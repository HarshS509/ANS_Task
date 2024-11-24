import { Edit2, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        setImagePreview(base64String);
        setImage(file);
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Error processing image. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const noteWithoutCurrentImage = currentNotes.filter(
      (note) => note.id !== editingNote?.id
    );

    const newNote = {
      id: editingNote?.id || Date.now(),
      title,
      description,
      image: imagePreview,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingNote) {
      setNotes(
        notes.map((note) => (note.id === editingNote.id ? newNote : note))
      );
    } else {
      setNotes([newNote, ...notes]);
    }

    resetForm();
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description);
    setImagePreview(note.image);
    setIsDialogOpen(true);
  };

  const handleDelete = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Notes
        </h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-[500px] mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <textarea
                placeholder="Note Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 h-32 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />

              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md inline-flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  {editingNote ? "Save Changes" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
          <ImageIcon className="h-16 w-16 mb-4" />
          <p className="text-lg">
            No notes available. Click "Add Note" to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                {note.image ? (
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap flex-grow">
                  {note.description}
                </p>
              </div>
              <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(note)}
                  className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesManager;
