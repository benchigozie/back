const notificationsRouter = require('express').Router();

const { getAllNotifications, storeNotifications } = require('../controllers/notificationscontroller');



notificationsRouter.get('/all', getAllNotifications);
notificationsRouter.post('/storenotification', storeNotifications);


module.exports = notificationsRouter;

