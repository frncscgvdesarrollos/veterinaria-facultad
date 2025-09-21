
import Link from 'next/link';

const DashboardCard = ({ title, description, link }) => {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </Link>
  );
};

export default DashboardCard;
