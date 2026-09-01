import { useState } from "react";
import { Camera, UserCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Profile Image
  const [profileImage, setProfileImage] = useState("");

  // User Details
  const [user] = useState({
    name: storedUser?.full_name || "Student Name",
    email: storedUser?.email || "student@example.com",
    phone: storedUser?.phone_number || "+91 0000000000",
    country: "India",
  });

  // Academic Details
  const [qualification, setQualification] = useState(
    localStorage.getItem("qualification") || ""
  );

  const [interestedCourse, setInterestedCourse] = useState(
    localStorage.getItem("interestedCourse") || ""
  );

  const [preferredCountry, setPreferredCountry] = useState(
    localStorage.getItem("preferredCountry") || ""
  );

  // Upload Profile Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Save Academic Details
  const handleSaveAcademic = () => {
    localStorage.setItem("qualification", qualification);
    localStorage.setItem("interestedCourse", interestedCourse);
    localStorage.setItem("preferredCountry", preferredCountry);

    alert("Academic details saved successfully!");
  };

  return (
    <>
      <Navbar />

      {/* Page Background */}
      <main className="uniera-page pt-28 pb-12">

        {/* Animated Background Content */}
        <div className="uniera-content max-w-6xl mx-auto px-6 animate-fade-in">

          {/* ================= HEADER ================= */}
          <div className="uniera-gradient rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl animate-slide-up">

            {/* Profile Image */}
            <div className="relative">

              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle
                    size={110}
                    strokeWidth={1.5}
                    className="text-gray-400"
                  />
                )}

              </div>

              {/* Camera Button */}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-white text-[#6C3CE9] flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition duration-300"
                title="Upload profile photo"
              >
                <Camera size={20} />
              </label>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

            </div>

            {/* User Info */}
            <div>
              <p className="text-purple-200 text-sm font-semibold uppercase tracking-wider mb-2">
                Student Profile
              </p>

              <h1 className="text-4xl font-bold">
                {user.name}
              </h1>

              <p className="text-lg mt-2 text-purple-100">
                {user.email}
              </p>

              <p className="text-purple-100">
                {user.phone}
              </p>
            </div>

          </div>

          {/* ================= PERSONAL INFORMATION ================= */}
          <div className="uniera-card rounded-3xl mt-8 p-8 animate-slide-up">

            <h2 className="text-2xl font-bold text-[#081D4A] mb-6">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={user.phone}
                  readOnly
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Country
                </label>

                <input
                  type="text"
                  value={user.country}
                  readOnly
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

            </div>

          </div>

          {/* ================= ACADEMIC DETAILS ================= */}
          <div className="uniera-card rounded-3xl mt-8 p-8 animate-slide-up">

            <h2 className="text-2xl font-bold text-[#081D4A] mb-6">
              Academic Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="font-semibold text-gray-700">
                  Qualification
                </label>

                <input
                  type="text"
                  value={qualification}
                  onChange={(e) =>
                    setQualification(e.target.value)
                  }
                  placeholder="Enter your qualification"
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Interested Course
                </label>

                <input
                  type="text"
                  value={interestedCourse}
                  onChange={(e) =>
                    setInterestedCourse(e.target.value)
                  }
                  placeholder="Enter interested course"
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Preferred Country
                </label>

                <input
                  type="text"
                  value={preferredCountry}
                  onChange={(e) =>
                    setPreferredCountry(e.target.value)
                  }
                  placeholder="Enter preferred country"
                  className="uniera-input w-full border rounded-lg p-3 mt-2 bg-gray-50"
                />
              </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8">

              <button
                onClick={handleSaveAcademic}
                className="uniera-gradient uniera-button text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
              >
                Save Academic Details
              </button>

            </div>

          </div>

          {/* ================= PROFILE SUMMARY ================= */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="uniera-card rounded-2xl p-6 text-center animate-slide-left">
              <p className="text-4xl font-bold text-indigo-700">
                12
              </p>

              <p className="mt-2 text-gray-600">
                Saved Scholarships
              </p>
            </div>

            <div className="uniera-card rounded-2xl p-6 text-center animate-slide-up">
              <p className="text-4xl font-bold text-green-600">
                5
              </p>

              <p className="mt-2 text-gray-600">
                Applications
              </p>
            </div>

            <div className="uniera-card rounded-2xl p-6 text-center animate-slide-right">
              <p className="text-4xl font-bold text-purple-700">
                85%
              </p>

              <p className="mt-2 text-gray-600">
                Eligibility Score
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;