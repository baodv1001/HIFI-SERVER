const express = require('express');

const router = express.Router();
const suggestionController = require('../../controllers/suggestion');

module.exports = (app) => {
	router.get('/skills', suggestionController.getSkills);
	router.get('/categories', suggestionController.getAllCategory);
	router.get('/users', suggestionController.getAllUser);
	router.get('/rooms/:userId', suggestionController.getRoomsByUserId);
	router.get('/rooms', suggestionController.getAllRooms);
	router.get('/universities', suggestionController.getUniversities);
	router.get('/majors', suggestionController.getMajors);
	router.get('/degrees', suggestionController.getDegrees);

	app.use('/api/suggestion', router);
};
