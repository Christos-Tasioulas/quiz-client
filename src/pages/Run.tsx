import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type { QuestionAnsweredRequest, Run} from '../types/Run';
import {calculateScore, fetchRunById, updateProgress} from "../services/run-api.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import Question from "../components/Question.tsx";
import './Run.css'

export default function Run(props: {token: string}) {

    const { id } = useParams();
    const [run, setRun] = useState<Run | null>(null); // null = not loaded yet
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

        if (!props.token) return;

        async function fetchCurrentRun() {
            try {
                const getCurrentRun = await fetchRunById(id)
                setRun(getCurrentRun)
            } catch (error) {
                console.error("Unable to fetch run" + error);
                setError("Unable to fetch run")
            } finally {
                setLoading(false);
            }
        }

        fetchCurrentRun();
    }, [id, props.token]);


    // ✅ 1. Show loader while fetching
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600 animate-pulse">Loading run...</p>
            </div>
        );
    }

    // ✅ 2. Show error if something went wrong
    if (error) {
        return (
            <ErrorMessage message={`Error: ${error}`} />
        );
    }

    // ✅ 3. Show “empty” message if run didn’t load properly
    if (!run || Object.keys(run).length === 0) {
        return (
            <ErrorMessage message={"No run data found."}/>
        );
    }

    const handleAnswer = async (updated: QuestionAnsweredRequest) => {
        // ✅ Optimistic UI update
        setRun(prevRun => {
            if (!prevRun) return prevRun;

            const updatedQuestions = prevRun.questions.map(q =>
                q.questionId === updated.questionId
                    ? { ...q, answerId: updated.answerId, questionAnswered: true }
                    : q
            );

            // Optionally update progress locally
            const answeredCount = updatedQuestions.filter(q => q.questionAnswered).length;
            const newProgress = Math.round((answeredCount / prevRun.totalQuestions) * 100);

            return { ...prevRun, questions: updatedQuestions, progress: newProgress };
        });

        try {
            await updateProgress(updated.runId.toString());
            // 🔹 No need to setRun again — UI is already in sync.
        } catch (error) {
            console.error("Failed to update progress:", error);
            setError("Could not save and load run");

            // ❌ Revert optimistic update if API failed
            setRun(prevRun => {
                if (!prevRun) return prevRun;
                const revertedQuestions = prevRun.questions.map(q =>
                    q.questionId === updated.questionId
                        ? { ...q, answerId: undefined, questionAnswered: false }
                        : q
                );
                return { ...prevRun, questions: revertedQuestions };
            });
        }
    };



    const handleEndRun = async () => {
        try {
            const updatedRun = await calculateScore(run.id?.toString())
            setRun(updatedRun)
            navigate("/"); // Can be redirected to a result screen it is up to the admin needs
        } catch (error) {
            setError(`Could not save and load run`)
            console.error(error)
        }
    }

    return (
        <div className="run-container index-${currentIndex}">
            <h1 className="run-title">
                {run.quizName}
            </h1>
            <div className="run-question-container">
                <Question question={run.questions[currentIndex]} onAnswered={handleAnswer}/>
            </div>
            <div className="run-buttons">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    className="run-button"
                >
                    Previous
                </button>

                {currentIndex < run.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex((i) => i + 1)}
                        className="run-button"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleEndRun} // define this to finish the run
                        className="run-button"
                    >
                        End
                    </button>
                )}
            </div>

            <div className="run-progress">
                Questions answered: {run.progress} %
            </div>
        </div>
    )
}