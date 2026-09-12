import { Router } from 'express';
import { databasePath } from '../db/database.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    database: databasePath
  });
});

export default router;
