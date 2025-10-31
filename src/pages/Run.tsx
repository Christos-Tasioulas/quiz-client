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
        try {
            const updatedRun = await updateProgress(updated.runId.toString())
            setRun(updatedRun)
        } catch (error) {
            setError(`Could not save and load run`)
            console.error(error)
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
        <div className="run-container">
            <h1 className="text-xl font-semibold mb-2">
                Run #{run.id} — {run.totalQuestions} Questions
            </h1>
            <div className="space-y-4">
                <Question question={run.questions[currentIndex]} onAnswered={handleAnswer}/>
            </div>
            <div className="flex justify-between mt-6">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                >
                    Previous
                </button>

                {currentIndex < run.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentIndex((i) => i + 1)}
                        className="px-4 py-2 rounded bg-blue-500 text-white"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleEndRun} // define this to finish the run
                        className="px-4 py-2 rounded bg-red-500 text-white"
                    >
                        End
                    </button>
                )}
            </div>

            <div className="mt-6 text-right text-sm text-gray-500">
                Questions answered: {run.progress} %
            </div>
        </div>
    )
}