const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: {
    type: String,
    enum: ['array', 'linkedlist', 'graph', 'dp'], // keep consistent
    required: true
  },
  visibleTestCases: [
    {
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      },
      explanation: {
        type: String,
        required: true
      }
    }
  ],
  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }
  ],
  startCode: [
    {
      language: {
        type: String,
        required: true
      },
      initialCode: {
        type: String,
        required: true
      }
    }
  ],
  referenceSolution: [
    {
      language: {
        type: String,
        required: true
      },
      completeCode: {
        type: String,
        required: true
      }
    }
  ],
  problemCreator: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Make sure your user model is capitalized 'User' if you have that
    required: true
  }
});

// Name the model 'Problem' for clarity
const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
