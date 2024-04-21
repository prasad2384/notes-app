import Express from 'express';
import { CreateNotesController, FetchNotesController, DeleteNotesController, FetchSingleNotes, UpdateNotesController } from '../Controllers/NotesController.js';

const router=Express.Router();

router.post('/create-notes',CreateNotesController);

router.get('/fetch-notes/:user_id',FetchNotesController);

router.delete('/delete-notes/:id',DeleteNotesController);

router.get('/fetch-single-notes/:id',FetchSingleNotes);

router.put('/update-notes/:id',UpdateNotesController);

export default router;