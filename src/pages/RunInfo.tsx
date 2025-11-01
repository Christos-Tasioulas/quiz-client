import {useNavigate, useParams} from "react-router-dom";
import {Trash} from "lucide-react";
import EntityMenu from "../components/EntityMenu.tsx";
import Modal from "../components/Modal.tsx";
import type {Run} from "../types/Run.tsx";
import {useEffect, useState} from "react";
import {deleteRun, fetchRunById} from "../services/run-api.tsx";
import {formatLocalDateTime} from "../utils/dateUtils.ts.tsx";
import './RunInfo.css'

export default function RunInfo(props: { token: string }) {

    const [run, setRun] = useState<Run>({} as Run);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const {id} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.token) return;

        const getRunById = async () => {
            try {
                const runResponse = await fetchRunById(id)
                setRun(runResponse)
            } catch (error) {
                console.error("Failed to fetch run:", error);
            } finally {
                setLoading(false);
            }
        }

        getRunById();
    }, [id, props.token])

    // Toggle the modal visibility
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        openDeleteModal(); // Open the modal when delete is triggered
    };

    const confirmDelete = async () => {
        try {
            await deleteRun(run.id?.toString())
            console.log('Run deleted');
            setIsDeleteModalOpen(false);  // Close the modal after confirmation
            navigate("/runs/list")
        } catch (error: unknown) {
            console.log(error)
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);  // Close the modal if the user cancels
    };

    const menuOptions = [
        {
            key: 1,
            Icon: Trash,
            text: "Delete Run",
            onClick: handleDelete
        }
    ]

    // ✅ 1. Show loader while fetching
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600 animate-pulse">Loading run...</p>
            </div>
        );
    }

    return (
        <main className="userinfo-container">
            <div className="user-info">
                <div className="user">
                    {/* Delete Profile Button */}
                    <EntityMenu menuOptions={menuOptions}/>
                    <div className="userInfo">
                        {/* Important Run Info */}
                        <h2 className='score'>Score: {run.score.toString()}</h2>
                        <h2 className='fullname'>{run.questionsAnswered} / {run.totalQuestions} answered</h2>
                        <h3 className='-username'>from {formatLocalDateTime(run.startedAt)} {run.finishedAt ? `to ${formatLocalDateTime(run.finishedAt)}` : "Currently Running"}</h3>
                    </div>
                    {/* Conditionally render the modal */}
                    {isDeleteModalOpen && (
                        <Modal
                            message="Are you sure you want to delete this run?"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}