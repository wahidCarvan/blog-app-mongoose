'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { BlogPost } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/posts', (req, res) => {
  BlogPost
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


app.delete('/posts/:id', (req, res) => {
	BlogPost.findByIdAndRemove(req.params.id).then(() => {
		res.status(204).json({message: 
			'success'});
	})
	.cathc(err => {
		console.error(err);
		res.status(500).json({error: 'something went wrong'});
	});
});


app.put('/posts/:id', (req, res) => {
	if(!(req.params.ide && req.body.id)){
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}
	const updated = {};
	const updatedableFields = ['title', 'content', 'author'];
	updatedableFields.forEach(field => {
		if (field in req.body){
			updated[field] = req.body[field];
		}
	});

BlogPost
.findByIdAndUpdate(req.params.id, { $ set: updated}, {new: true}).then(updatedPost => res.status(204).end())
.cathc(err => res.status(500).json({
	message: 'Something went wrong'
}));
)};

app.delete('/:id', (req, res) => {
	BlogPost.findByIdAndRemove(req.params.id).then(() => {
		console.log(`Deleted blog post with id \`${req.params.id}\``);
		res.status(204).end();
	});
});

app.use('*', function(req, res){
	res.status(404).json({message: 'Not Found'});
});

//close server needs access to a server object, but that only gets created when runServer runs, so we decalre server here and then assing a value to it in run 
let server;

































})