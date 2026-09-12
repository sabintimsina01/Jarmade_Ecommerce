import crypto from 'node:crypto';
import session from 'express-session';
import { db } from '../db/database.js';

class SQLiteSessionStore extends session.Store {
  get(sid, callback) {
    try {
      const row = db.prepare('SELECT sess, expired FROM sessions WHERE sid = ?').get(sid);

      if (!row) {
        return callback(null, null);
      }

      if (row.expired <= Date.now()) {
        db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
        return callback(null, null);
      }

      const parsedSession = JSON.parse(row.sess);

      if (parsedSession.cookie?.expires) {
        parsedSession.cookie.expires = new Date(parsedSession.cookie.expires);
      }

      return callback(null, parsedSession);
    } catch (error) {
      return callback(error);
    }
  }

  set(sid, sess, callback) {
    try {
      const expired = getSessionExpiry(sess);

      db.prepare(`
        INSERT INTO sessions (sid, sess, expired)
        VALUES (?, ?, ?)
        ON CONFLICT(sid) DO UPDATE SET
          sess = excluded.sess,
          expired = excluded.expired
      `).run(sid, JSON.stringify(sess), expired);

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback) {
    try {
      db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sid, sess, callback) {
    try {
      db.prepare('UPDATE sessions SET expired = ? WHERE sid = ?').run(getSessionExpiry(sess), sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

function getSessionExpiry(sess) {
  const expires = sess.cookie?.expires;

  if (expires) {
    return new Date(expires).getTime();
  }

  return Date.now() + getSessionMaxAge();
}

function getSessionMaxAge() {
  return 1000 * 60 * 60 * 24 * 30;
}

function getSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production.');
  }

  console.warn('SESSION_SECRET is not set. Using an ephemeral development secret.');
  return crypto.randomBytes(32).toString('hex');
}

export function createSessionMiddleware() {
  return session({
    name: 'jarmade.sid',
    secret: getSessionSecret(),
    store: new SQLiteSessionStore(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: getSessionMaxAge(),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  });
}

export function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
