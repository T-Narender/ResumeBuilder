import React, { useState } from "react";
import { Input } from "./Inputs";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { Plus } from "lucide-react";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      if (response.data?._id) {
        navigate(`/edit-resume/${response.data._id}`);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl p-8 sm:p-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-md mb-4">
          <Plus size={28} className="text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Create New Resume
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
          Give your resume a title to get started. You can always update it later.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateResume} className="space-y-6">
        <div className="w-full text-left">
          <Input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            label="Resume Title"
            placeholder="e.g. Software Engineer Resume"
            type="text"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
        >
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
