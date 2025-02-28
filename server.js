import * as Index from './src/index.js';
import taskRouter from './src/routes/taskRoutes.js';
import userRouter from './src/routes/userRoutes.js';

const app = Index.express();
app.use(Index.cors());
app.use(Index.express.json());

const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.get('/', (req, res) => {
    res.send("hello world of testing the deployment on vercel...");
});

console.log("Current Environment:", process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`app listen on ${port}`);
    });
}

export default app;