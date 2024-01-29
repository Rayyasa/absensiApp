import React, { useState, useEffect } from "react";
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StudentAttendanceApp = () => {
  const [attendanceData, setAttendanceData] = useState(() => {
    const data = localStorage.getItem("attendanceData");
    return data ? JSON.parse(data) : {};
  });

  const [absentReasons, setAbsentReasons] = useState(() => {
    const data = localStorage.getItem("absentReasons");
    return data ? JSON.parse(data) : {};
  });

  const [students, setStudents] = useState(() => {
    const data = localStorage.getItem("students");
    return data ? JSON.parse(data) : [];
  });

  const [selectedAbsentStudentIds, setSelectedAbsentStudentIds] = useState([]);

  const [isReasonSubmitted, setIsReasonSubmitted] = useState(false);

  const [newStudentName, setNewStudentName] = useState("");

  const [submittedStudentName, setSubmittedStudentName] = useState("");

  useEffect(() => {
    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  }, [attendanceData]);

  useEffect(() => {
    localStorage.setItem("absentReasons", JSON.stringify(absentReasons));
  }, [absentReasons]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleAttendance = (studentId) => {
    const currentDate = getCurrentDate();
    const newData = { ...attendanceData };

    if (newData[currentDate]) {
      if (newData[currentDate][studentId]) {
        delete newData[currentDate][studentId];
      } else {
        newData[currentDate][studentId] = new Date().toLocaleTimeString();
      }
    } else {
      newData[currentDate] = { [studentId]: new Date().toLocaleTimeString() };
    }
    setAttendanceData(newData);

    setSelectedAbsentStudentIds([]);

    setIsReasonSubmitted(false);
  };

  const handleAbsentButtonClick = (studentId) => {
    setSelectedAbsentStudentIds((prevSelectedAbsentStudentIds) => [
      ...prevSelectedAbsentStudentIds,
      studentId,
    ]);
  };

  const handleAbsentReasonChange = (studentId, event) => {
    const updatedAbsentReasons = { ...absentReasons };
    updatedAbsentReasons[studentId] = event.target.value;
    setAbsentReasons(updatedAbsentReasons);
  };

  const handleReasonSubmit = () => {
    setIsReasonSubmitted(true);
  };

  const handleAddStudent = () => {
    if (newStudentName.trim() !== "") {
      const newStudentId =
        students.length > 0 ? students[students.length - 1].id + 1 : 1;
      const newStudent = { id: newStudentId, name: newStudentName };
      const newStudents = [...students, newStudent];
      setStudents(newStudents);
      setSubmittedStudentName(newStudentName);
      setNewStudentName("");

      localStorage.setItem("students", JSON.stringify(newStudents));
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Absensi Siswa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Kartu untuk setiap siswa */}
        {students.map((student) => (
          <div key={student.id} className="border rounded-md p-4 border-black">
            {/* Nama siswa */}
            <span className="text-lg font-semibold">{student.name}</span>
            <div className="mt-2">
              {/* Logika tombol hadir/tidak hadir */}
              {attendanceData[getCurrentDate()]?.[student.id] ? (
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleAttendance(student.id)}
                    className="py-1 px-3 rounded bg-green-500 text-white"
                  >
                    Hadir saat :
                  </button>
                  <span className="ml-2 text-sm text-gray-500">
                    {attendanceData[getCurrentDate()][student.id]}
                  </span>
                </div>
              ) : (
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleAttendance(student.id)}
                    className="py-1 px-3 rounded bg-gray-300"
                  >
                    Hadir
                  </button>
                  <button
                    onClick={() => handleAbsentButtonClick(student.id)}
                    className={`ml-2 py-1 px-4 rounded ${
                      selectedAbsentStudentIds.includes(student.id) &&
                      !isReasonSubmitted
                        ? "bg-red-500 text-white"
                        : "bg-red-300"
                    }`}
                  >
                    Tidak Hadir
                  </button>
                </div>
              )}
            </div>
            {/* Input alasan tidak hadir */}
            {selectedAbsentStudentIds.includes(student.id) &&
              !isReasonSubmitted && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={absentReasons[student.id] || ""}
                    onChange={(event) =>
                      handleAbsentReasonChange(student.id, event)
                    }
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Alasan tidak hadir"
                  />
                </div>
              )}
            {/* Menampilkan alasan tidak hadir setelah disubmit */}
            {isReasonSubmitted &&
              selectedAbsentStudentIds.includes(student.id) && (
                <div className="mt-2">
                  <p className="text-sm">
                    Alasan tidak hadir: {absentReasons[student.id]}
                  </p>
                </div>
              )}
          </div>
        ))}
      </div>
      {/* Tombol "Submit Alasan" hanya ditampilkan jika ada siswa yang dipilih tidak hadir dan alasan belum disubmit */}
      {selectedAbsentStudentIds.length > 0 && !isReasonSubmitted && (
        <div className="mt-4 text-center">
          <button
            onClick={handleReasonSubmit}
            className="py-1 px-3 rounded bg-blue-500 text-white"
          >
            Submit Alasan
          </button>
        </div>
      )}
      {/* Input untuk menambahkan siswa baru */}
      <div className="mt-4">
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Nama Siswa Baru"
        />
        <button
          onClick={handleAddStudent}
          className="ml-2 py-1 px-3 rounded bg-blue-500 text-white"
        >
          Tambah Siswa
        </button>
      </div>
      {/* Pesan konfirmasi penambahan siswa baru */}
      {submittedStudentName && (
        <p className="mt-2">
          Siswa baru {submittedStudentName} telah ditambahkan.
        </p>
      )}
    </div>
  );
};

export default StudentAttendanceApp;
