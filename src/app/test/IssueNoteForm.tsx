"use client"

import type React from "react"
import { useState } from "react"
import { PlusCircle, X } from "lucide-react"

interface IssueNote {
  text: string
}

interface FormData {
  [prefix: string]: {
    [flag: string]: IssueNote[]
  }
}

const IssueNoteForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    Date: {},
    Rate: {},
  })

  const [newFlagName, setNewFlagName] = useState<{ [key: string]: string }>({
    Date: "",
    Rate: "",
  })

  const handleIssueNoteChange = (prefix: string, flag: string, index: number, value: string) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      newData[prefix][flag][index].text = value
      return newData
    })
  }

  const addIssueNote = (prefix: string, flag: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [prefix]: {
        ...prevData[prefix],
        [flag]: [...(prevData[prefix][flag] || []), { text: "" }], // Ensure existing issue notes are preserved
      },
    }));
  };
  

  const removeIssueNote = (prefix: string, flag: string, index: number) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      if (newData[prefix][flag].length > 1) {
        newData[prefix][flag].splice(index, 1)
      }
      return newData
    })
  }

  const addFlag = (prefix: string) => {
    if (!newFlagName[prefix] || newFlagName[prefix].trim() === "") {
      alert("Please enter a flag name");
      return;
    }
  
    if (formData[prefix][newFlagName[prefix]]) {
      alert("Flag name already exists");
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [prefix]: {
        ...prevData[prefix],
        [newFlagName[prefix]]: [{ text: "" }], // Ensures only one input field is initialized
      },
    }));
  
    setNewFlagName((prev) => ({ ...prev, [prefix]: "" }));
  };
  
  

  const removeFlag = (prefix: string, flag: string) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      delete newData[prefix][flag]
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    for (const prefix of ["Date", "Rate"]) {
      if (Object.keys(formData[prefix]).length === 0) {
        alert(`Please add at least one flag for ${prefix}`)
        return
      }
    }

    try {
      console.log(formData, "formData")
      const response = await fetch("/api/submitIssueNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (response.ok) {
        alert(result.message)
      } else {
        alert("Error submitting data.")
      }
    } catch (error) {
      alert("Error: " + error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-8 space-y-10 bg-gray-50 rounded-xl">
      {["Date", "Rate"].map((prefix) => (
        <div key={prefix} className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{prefix}</h3>
          </div>

          <div className="p-6 space-y-8">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter flag name"
                value={newFlagName[prefix]}
                onChange={(e) => setNewFlagName((prev) => ({ ...prev, [prefix]: e.target.value }))}
                className="flex-grow px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
              />
              <button
                type="button"
                onClick={() => addFlag(prefix)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm hover:shadow-md"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add Flag
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {Object.entries(formData[prefix]).map(([flag, issueNotes]) => (
                <div key={flag} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800">{flag}</h4>
                    <button
                      type="button"
                      onClick={() => removeFlag(prefix, flag)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {issueNotes.map((issueNote, issueNoteIndex) => (
                      <div key={issueNoteIndex} className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder={`Enter IssueNote for ${flag}`}
                          value={issueNote.text}
                          onChange={(e) => handleIssueNoteChange(prefix, flag, issueNoteIndex, e.target.value)}
                          className="flex-grow px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                        />
                        {issueNotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIssueNote(prefix, flag, issueNoteIndex)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addIssueNote(prefix, flag)}
                      className="w-full mt-2 text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200 border-dashed"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" /> Add IssueNote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-lg font-semibold shadow-sm hover:shadow-md"
      >
        Submit
      </button>
    </form>
  )
}

export default IssueNoteForm