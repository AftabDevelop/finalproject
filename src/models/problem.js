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
    enum: ['array', 'linkedlist', 'graph', 'dp'],
    required: true
  },

  // Visible / public test cases
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

  // Hidden / AI test cases (with explanation)
  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      },
      explanation: {          // 🔥 newly added
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
    ref: 'User',
    required: true
  }
});

// Name the model 'Problem'
const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
