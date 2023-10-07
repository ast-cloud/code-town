import mongoose from "mongoose";

  
const problemSchema = new mongoose.Schema({
    problemCode: String,
    title: String,
    description: String,
    category: String,
    difficulty: String,
    inputCases: String,
    expectedOutput: String,
  });
  
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    image: String,
    solvedProblems: [{type:mongoose.Schema.Types.ObjectId, ref:'Problem'}]
  });

const categorySchema = new mongoose.Schema({
  categoryId: String,
  categoryName: String
});
  
export const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
