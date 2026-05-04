  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import mongoose from "mongoose";
  import User from "./Models/user.js";
  import Task from "./Models/task.js";
  import session from "express-session";
  import MongoStore from "connect-mongo";
  import passport from "passport";
  import LocalStrategy from "passport-local";
  import ExpressError from "./utils/ExpressError.js";

  dotenv.config();

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected!"))
    .catch((err) => {
      console.log(err);
    });

  const app = express();

  app.use(
    cors({
      origin: process.env.FRONT_END_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
  });

  app.use(
    session({
      store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(express.json());

  app.post("/create", async (req, res, next) => {
    try {
      const { title, description, priority, dueDate, assignedTo } = req.body;

      if (!req.user) {
        return next(new ExpressError(401, "User not authenticated"));
      }

      if (!assignedTo) {
        return next(new ExpressError(400, "Assigned to is required"));
      }

      const task = new Task({
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        createdBy: req.user.id,
      });

      await task.save();
      res.status(201).json({ message: "Task created successfully" });
    } catch (err) {
      next(err);
    }
  });

  app.get("/me", (req, res) => {
    if (req.user) {
      res.json({
        user: {
          username: req.user.username,
          email: req.user.email,
        },
      });
    } else {
      res.status(401).json({ user: null });
    }
  });

  app.get("/tasks", async (req, res, next) => {
    try {
      let { status } = req.query;

      let filter = {};

      if (status) {
        filter.status = status;
      }

      let tasks;

      if (req.user.username === "admin") {
        tasks = await Task.find(filter);
      } else {
        tasks = await Task.find({
          ...filter,
          assignedTo: req.user.username,
        });
      }

      tasks = tasks.map((task) => {
        return {
          ...task.toObject(),
        };
      });

      const allTasks = await Task.countDocuments(
        req.user.username === "admin" ? {} : { assignedTo: req.user.username }
      );

      const pendingTasks = await Task.countDocuments({
        status: "Pending",
        ...(req.user.username != "admin" && { assignedTo: req.user.username }),
      });

      const inProgressTasks = await Task.countDocuments({
        status: "In Progress",
        ...(req.user.username != "admin" && { assignedTo: req.user.username }),
      });

      const completedTasks = await Task.countDocuments({
        status: "Completed",
        ...(req.user.username != "admin" && { assignedTo: req.user.username }),
      });

      res.json({
        total: allTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        tasks,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get("/task/:id", async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return next(new ExpressError(404, "Task not found!"));
      }

      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  });

  app.put("/task/:id", async (req, res, next) => {
    try {
      let task = await Task.findById(req.params.id);
  
      if (!task) {
        return next(new ExpressError(404, "Task not found"));
      }
  
   
      if (req.user.username === "admin") {
        const { title, description, priority, dueDate, assignedTo, status } = req.body;
  
        if (title) task.title = title;
        if (description) task.description = description;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        if (assignedTo) task.assignedTo = assignedTo;
        if (status) task.status = status;
      }
  
 
      else {
        const { status } = req.body;
  
        if (!status) {
          return next(new ExpressError(400, "Status is required"));
        }
  
        task.status = status;
      }
  
      await task.save();
  
      res.status(200).json({
        task,
        message: "Task updated successfully!",
      });
  
    } catch (err) {
      next(err);
    }
  });

  app.delete("/task/:id", async (req, res, next) => {
    try {
      let task = await Task.findById(req.params.id);

      if (!task) {
        return next(new ExpressError(404, "Task not found"));
      }

      await task.deleteOne();

      res.status(200).json({ message: "Task deleted successfully!" });
    } catch (err) {
      next(err);
    }
  });

  app.post("/signup", async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const newUser = new User({
        username,
        email,
      });

      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }

        res.status(201).json({
          success: true,
          message: "Signup successful",
          user: {
            id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email,
          },
        });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({ success: true, message: "Logged in successfully" });
  });

  app.post("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error logging out" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    res.status(status).json({
      message,
    });
  });

  app.listen(8080, () => {
    console.log("Server is listening");
  });