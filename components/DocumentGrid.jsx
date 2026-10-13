import {
  BadgeCheck,
  FileText,
  Globe,
  BookOpen,
  Users,
  Plane,
  CheckCircle2,
  Clock3,
  Lock,
} from "lucide-react";

import DocumentCard from "./DocumentCard";

function DocumentGrid() {
  const documents = [
    {
      title: "Passport",
      description:
        "Valid passport uploaded and verified successfully.",
      icon: <BadgeCheck className="text-[#6533E2]" size={28} />,
      status: "Done",
      statusColor: "bg-green-100 text-green-700",
      statusIcon: <CheckCircle2 size={15} />,
      upload: false,
    },

    {
      title: "Transcripts",
      description:
        "Academic transcripts are available and verified.",
      icon: <FileText className="text-[#6533E2]" size={28} />,
      status: "Done",
      statusColor: "bg-green-100 text-green-700",
      statusIcon: <CheckCircle2 size={15} />,
      upload: false,
    },

    {
      title: "English Test",
      description:
        "Upload your IELTS / TOEFL / Duolingo English Test score.",
      icon: <Globe className="text-[#6533E2]" size={28} />,
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      statusIcon: <Clock3 size={15} />,
      upload: true,
    },

    {
      title: "Statement of Purpose",
      description:
        "Your SOP has been uploaded and approved.",
      icon: <BookOpen className="text-[#6533E2]" size={28} />,
      status: "Done",
      statusColor: "bg-green-100 text-green-700",
      statusIcon: <CheckCircle2 size={15} />,
      upload: false,
    },

    {
      title: "Letters of Recommendation",
      description:
        "Recommendation letters received successfully.",
      icon: <Users className="text-[#6533E2]" size={28} />,
      status: "Done",
      statusColor: "bg-green-100 text-green-700",
      statusIcon: <CheckCircle2 size={15} />,
      upload: false,
    },

    {
      title: "Visa Form",
      description:
        "Upload your visa documents whenever they become available.",
      icon: <Plane className="text-[#6533E2]" size={28} />,
      status: "Optional",
      statusColor: "bg-gray-200 text-gray-700",
      statusIcon: <Lock size={15} />,
      upload: true,
      optional: true,
    },
  ];

  return (
    <section className="grid lg:grid-cols-3 md:grid-cols-2 gap-7">
      {documents.map((doc, index) => (
        <DocumentCard
          key={index}
          title={doc.title}
          description={doc.description}
          icon={doc.icon}
          status={doc.status}
          statusColor={doc.statusColor}
          statusIcon={doc.statusIcon}
          upload={doc.upload}
          optional={doc.optional}
        />
      ))}
    </section>
  );
}

export default DocumentGrid;