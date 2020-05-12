import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, errorMessage } from './util/util';

(async () => {
	// Init the Express application
	const app = express();

	// Set the network port
	const port = process.env.PORT || 8082;

	// Use the body parser middleware for post requests
	app.use(bodyParser.json());

	// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
	// GET /filteredimage?image_url={{URL}}
	// endpoint to filter an image from a public url.
	// IT SHOULD
	//    1
	//    1. validate the image_url query
	//    2. call filterImageFromURL(image_url) to filter the image
	//    3. send the resulting file in the response
	//    4. deletes any files on the server on finish of the response
	// QUERY PARAMATERS
	//    image_url: URL of a publicly accessible image
	// RETURNS
	//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

	/**************************************************************************** */
	app.get('/filteredimage', async (req : Request, res : Response) => {
		let error = new errorMessage();
		const url: string = req.query.image_url;
		// Tested for url
		// http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg

		// Check if url is provided
		if (!url) {
			return res.status(400).send({
				message: error.error_400
			});
		}

		try {
			// check if image exists,and if yes, fetch the image
			const filteredURL = await filterImageFromURL(url);
			res.sendFile(filteredURL, {}, () => deleteLocalFiles([ filteredURL ]));
		} catch (error) {
			// Send error code 422 according to rubric.
			res.sendStatus(422).send(error.error_422);
			console.error(error);
		}
	});
	//! END @TODO1

	// Root Endpoint
	// Displays a simple message to the user
	app.get('/', async (req, res) => {
		res.sendStatus(200).send('try GET /filteredimage?image_url={{}}');
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
