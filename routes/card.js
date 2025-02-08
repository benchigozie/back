const cardRouter = require('express').Router();

const { getAllCards, getUsersCards, registerCard, enableCard, disableCard, deleteCard } = require('../controllers/cardController');





cardRouter.get('/all', getAllCards);
cardRouter.get('/mycards', getUsersCards);
cardRouter.post('/register', registerCard);
cardRouter.put('/enable', enableCard);
cardRouter.put('/disable', disableCard);
cardRouter.put('/delete', deleteCard);


module.exports = cardRouter;