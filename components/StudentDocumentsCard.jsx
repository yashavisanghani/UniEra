import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function StudentDocumentsCard() {
  const documents = [
    {
      name: "Passport",
      status: "Uploaded",
      uploaded: true,
    },
    {
      name: "Academic Transcript",
      status: "Uploaded",
      uploaded: true,
    },
    {
      name: "Statement of Purpose",
      status: "Pending",
      uploaded: false,
    },
    {
      name: "Letters of Recommendation",
      status: "Pending",
      uploaded: false,
    },
  ];

  return (
    <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl font-bold text-[#001A47]">
          Documents
        </h2>

        <div className="w-11 h-11 rounded-xl bg-[#E9E2FF] flex items-center justify-center">

          <FileText
            className="text-[#6533E2]"
            size={22}
          />

        </div>

      </div>

      {/* Documents */}

      <div className="space-y-5">

        {documents.map((doc, index) => (

          <div
            key={index}
            className="border border-purple-100 bg-[#FCFBFF] rounded-2xl p-5 hover:border-[#6533E2] hover:shadow-md transition-all duration-300"
          >

            <div className="flex justify-between items-center gap-4">

              <div>

                <h3 className="font-semibold text-[#001A47]">
                  {doc.name}
                </h3>

                <div className="mt-2">

                  {doc.uploaded ? (

                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">

                      <CheckCircle size={16} />

                      Uploaded

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">

                      <AlertCircle size={16} />

                      Pending

                    </span>

                  )}

                </div>

              </div>

              <button
                className="flex items-center gap-2 bg-[#6533E2] hover:bg-[#4e26b5] text-white px-4 py-2 rounded-xl transition shadow-sm hover:shadow-md"
              >

                <Upload size={16} />

                Upload

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Completion */}

      <div className="mt-8">

        <div className="flex justify-between text-sm mb-2">

          <span className="font-medium text-gray-600">
            Completion
          </span>

          <span className="font-bold text-[#6533E2]">
            50%
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-[#E5E0F5] overflow-hidden">

          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-[#6533E2] to-[#8B5CF6]"></div>

        </div>

      </div>

    </div>
  );
}

export default StudentDocumentsCard;