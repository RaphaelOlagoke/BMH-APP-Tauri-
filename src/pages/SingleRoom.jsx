import React, { useState } from 'react';
import { Archive, Edit3, CheckCircle } from 'lucide-react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import AddRoom from "../Modals/AddRoom.jsx";
import UpdateRoom from "../Modals/UpdateRoom.jsx";
import {ROOM_TYPES, USER} from "../utils/index.js";
import restClient from "../utils/restClient.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

const SingleRoom = () => {
    const { state } = useLocation();
    const { id } = useParams();

    console.log(id);

    const [room, setRoom] = useState(state?.room);

    const [description, setDescription] = useState('');
    const [markingCompleteId, setMarkingCompleteId] = useState(null);
    const [completionCost, setCompletionCost] = useState('');
    const [showUpdateRoom, setShowUpdateRoom] = useState(false);
    const [showArchiveRoom, setShowArchiveRoom] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [selectedType, setSelectedType] = useState(room.roomType || '');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);

    const roomTypes = ROOM_TYPES;

    const onArchive = () => {
        setModalMessage(`Are you sure you want to archive Room ${room.roomNumber}?`)
        setShowArchiveRoom(true);
    };

    const onUnArchive = () => {
        setModalMessage(`Are you sure you want to unarchive Room ${room.roomNumber}?`)
        setShowArchiveRoom(true);
    };
    const onUpdateRoomStatus= () => {
        setShowUpdateRoom(true);
    };

    const onUpdateRoom = () => {
        state.room.roomType = selectedType;
        setRoom(state.room);
    }
    const onAddMaintenance= () => {

    };
    const onMarkComplete= () => {

    };

    const handleAddMaintenance = (e) => {
        e.preventDefault();
        if (description) {
            setShowConfirm(true);
            setDescription('');
        }
    };

    const confirmSubmission = () => {
        console.log(`Adding Maintenance to Room: ${room.roomNumber}`);
        onAddMaintenance({ description });
        setShowConfirm(false);
    };

    const confirmArchiveRoom = async () => {
        console.log(`Archiving Room: ${room.roomNumber}`);
        setShowArchiveRoom(false);
        setLoading(true);
        try {
            var endpoint = room.archived ? "/room/unarchive" : "/room/archive"
            const res = await restClient.post(`${endpoint}?roomNumber=${room.roomNumber}`, {}, navigate);
            console.log(res)
            if(res.responseHeader.responseCode === "00") {
                setModalMessage(room.archived ? "Room unarchived Successfully" : "Room Archived Successfully" );
                setShowSuccessModal(true);
            }
            else{
                setModalMessage(res.error ?? "Something went wrong!");
                setShowError(true);
            }
        }
            // eslint-disable-next-line no-unused-vars
        catch (error) {
            setModalMessage("Something went wrong!");
            setShowError(true);
        }
        finally {
            setLoading(false);
        }
    };

    const onArchiveSuccess = () => {
        setShowSuccessModal(false)
        state.room.archived = !state.room.archived;
        setRoom(state.room);
    }

    const handleComplete = (id) => {
        if (completionCost) {
            onMarkComplete(id, Number(completionCost));
            setMarkingCompleteId(null);
            setCompletionCost('');
        }
    };

    return (
        <div>
            <div className="p-6 max-w-6xl mx-auto space-y-6 text-start">
                {loading && <LoadingScreen />}
                <BackButton/>
                {/* Room Status Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Room #{room.roomNumber}</h2>
                    <div className="flex items-center gap-3">
          <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.roomStatus === "AVAILABLE"
                      ? 'bg-green-300 text-green-700'
                      : 'bg-blue-100 text-blue-600'
              }`}
          >
            {room.roomStatus}
          </span>
                {USER.department === "SUPER_ADMIN" && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onUpdateRoomStatus(room.id)}
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                            <Edit3 size={16} />
                            Update
                        </button>

                        {!room.archived ? (
                            <button
                                onClick={() => onArchive(room.id)}
                                className="text-red-600 hover:underline text-sm flex items-center gap-1"
                            >
                                <Archive size={16} />
                                Archive
                            </button>
                        ) : (
                            <button
                                onClick={() => onUnArchive(room.id)}
                                className="text-red-600 hover:underline text-sm flex items-center gap-1"
                            >
                                <Archive size={16} />
                                UnArchive
                            </button>
                        )}
                    </div>
                )}

            </div>
                </div>

                {/* Room Details */}
                <div className="bg-white rounded-lg shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Room Number:</strong> {room.roomNumber}</div>
                    <div><strong>Room Type:</strong> {room.roomType}</div>
                    <div><strong>Needs Cleaning:</strong> {room.needsCleaning ? 'Yes' : 'No'}</div>
                    <div><strong>Needs Maintenance:</strong> {room.needsMaintenance ? 'Yes' : 'No'}</div>
                    <div><strong>Archived:</strong> {room.archived ? 'Yes' : 'No'}</div>
                </div>

                {/* Maintenance Table */}
                <div className="bg-white shadow rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3">Maintenance History</h3>
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Ref</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Cost</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Created On</th>
                            <th className="px-4 py-2 text-left">Completed On</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {room.maintenance.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">No records found.</td>
                            </tr>
                        ) : (
                            room.maintenance.map((record) => (
                                <tr key={record.ref} className="border-t">
                                    <td className="px-4 py-2">{record.ref}</td>
                                    <td className="px-4 py-2">{record.description}</td>
                                    <td className="px-4 py-2">₦{record.cost || '-'}</td>
                                    <td className="px-4 py-2">
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {record.status}
                    </span>
                                    </td>
                                    <td className="px-4 py-2">{record.createdDateTime}</td>
                                    <td className="px-4 py-2">{record.lastModifiedDateTime || '-'}</td>
                                    <td className="px-4 py-2">
                                        {record.status !== 'COMPLETED' && markingCompleteId !== record.ref && (
                                            <button
                                                onClick={() => setMarkingCompleteId(record.ref)}
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                Mark as Complete
                                            </button>
                                        )}

                                        {markingCompleteId === record.ref && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Cost"
                                                    className="border px-2 py-1 rounded w-20"
                                                    value={completionCost}
                                                    onChange={(e) => setCompletionCost(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleComplete(record.ref)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Add Maintenance Form */}
                <div className="bg-white shadow rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3">Add Maintenance Record</h3>
                    <form onSubmit={handleAddMaintenance} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border px-3 py-2 rounded"
                            required
                        />
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* ✅ Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    message={`Are you sure you want to add this maintenance to Room ${room.roomNumber}?`}
                    onConfirm={confirmSubmission}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showArchiveRoom && (
                <ConfirmModal
                    message={modalMessage}
                    onConfirm={confirmArchiveRoom}
                    onCancel={() => setShowArchiveRoom(false)}
                />
            )}

            {showUpdateRoom && (
                <UpdateRoom
                    roomTypes={roomTypes}
                    currentType={room.roomType}
                    onClose={() => setShowUpdateRoom(false)}
                    onUpdate={onUpdateRoom}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    room={room}
                />
            )}

            {/* ✅ Missing Fields Modal */}
            {showError && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => setShowError(false)}
                />
            )}

            {showSuccessModal && (
                <ConfirmModal
                    message={modalMessage}
                    onCancel={() => onArchiveSuccess()}
                />
            )}

        </div>

    );
};

export default SingleRoom;
