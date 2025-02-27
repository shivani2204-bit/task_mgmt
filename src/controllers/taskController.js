import mongoose from 'mongoose';
import { User } from '../models/user.js';
import { Task } from '../models/task.js';


export const createTask = async (req, res) => {
    const { title, description, assignedTo, status } = req.body;

    try {
        const task = new Task({
            title,
            description,
            assignedTo,
            status,
        });

        await task.save();
        res.status(201).json({
            message: "Task created",
            task
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ assignedTo: userId });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTaskWithUserAssignment = async (req, res) => {
    const { title, description, status, userId } = req.body;
    console.log("req", req.body)
    // const indexes = await Task.collection.getIndexes();
    // console.log(indexes, "II");
    // const userId = req.user.id;
    const session = await mongoose.startSession();  // Starting a session for the transaction

    try {
        session.startTransaction();  // Begin the transaction

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }
        const user = await User.findById(userId);
        if (!user || userId.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        const task = new Task({
            title,
            description,
            assignedTo: userId,
            status: status || 'pending',
        });

        await task.save({ session });  // Save the task within the transaction

        // Optionally, update the user (for example, adding task ID to the user's tasks array)
        await User.updateOne(
            { _id: { $in: userId } },
            { $push: { tasks: task._id } },  // Assuming there's a "tasks" array in the User model
            { session }
        );

        await session.commitTransaction();  // Commit the transaction if everything went fine
        console.log('Task created and assigned successfully');
        res.status(201).json({
            message: 'Task created and assigned successfully',
            task
        });
    } catch (error) {
        await session.abortTransaction();  // Rollback the transaction if there's an error
        console.error('Error occurred during task creation or assignment:', error);
        res.status(500).json({
            message: 'Error occurred during task creation or assignment',
            error
        });
    } finally {
        session.endSession();
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    console.log(req.user, "req user")

    try {
        const task = await Task.findById(taskId);
        console.log("req.user._id100", req.user.id)
        if (!task) {
            return res.status(404).json({
                status: 404,
                message: "Task not found"
            });
        }
        if (!req.user || !task.assignedTo) {
            console.log("req.user._id", req.user.id)
            return res.status(400).json({
                message: 'User or task assignment missing'
            });
        }

        // Admin can update any task; user can only update their assigned tasks
        console.log("req.user._id115", req.user.id)
        if (req.user.role !== 'admin' && req.user.id.toString() !== task.assignedTo.toString()) {
            console.log("req.user._id117", req.user.id)
            console.log("task.assignedTo", task.assignedTo)
            return res.status(403).json({
                message: "Unauthorized to update task"
            });
        }

        task.status = status;
        await task.save();
        res.status(200).json({
            message: "Task status updated",
            task
        });
    } catch (error) {
        console.log(" log error", error)
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        const assignedUserId = task.assignedTo;

        // Admin can delete any task; user can only delete their assigned tasks
        if (req.user.role !== 'admin' && req.user.id.toString() !== task.assignedTo.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete task" });
        }

        // await Task.deleteOne({ _id: taskId });
        await Task.findByIdAndDelete(taskId);
        await User.updateOne(
            { _id: assignedUserId },
            { $pull: { tasks: taskId } } // Remove the task ID from the 'tasks' array of the user
        );

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: 'Error occurred while deleting task',
            error
        });
    }
};
