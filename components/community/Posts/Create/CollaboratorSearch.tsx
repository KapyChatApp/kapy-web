import { useState } from "react";
import { Icon } from "@iconify/react";

interface Collaborator {
  id: number;
  username: string;
  name: string;
  avatar: string;
}

const mockData: Collaborator[] = [
  {
    id: 1,
    username: "_danthuongngan_",
    name: "Dan Thuong Ngan",
    avatar:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
  },
  {
    id: 2,
    username: "dilysntnl",
    name: "Như Linh",
    avatar:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
  },
  {
    id: 3,
    username: "_dhnguyn_",
    name: "D. Nguyen",
    avatar:
      "https://res.cloudinary.com/dtn9r75b7/image/upload/v1735733280/Avatar/ghlgwprdxd1jxlus3arx.png"
  }
];

const CollaboratorSearch = ({
  searchCollaborator,
  setSearchCollaborator
}: {
  searchCollaborator: string;
  setSearchCollaborator: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [filteredUsers, setFilteredUsers] = useState<Collaborator[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // Trạng thái đã chọn

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCollaborator(value);
    setIsSelected(false); // Khi gõ lại, reset về trạng thái chưa chọn

    if (value.trim() === "") {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = mockData.filter(
      (user) =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelectUser = (user: Collaborator) => {
    setSearchCollaborator(user.name);
    setIsSelected(true); // Đánh dấu là đã chọn
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between w-full h-10">
        <input
          type="text"
          placeholder="Add collaborators..."
          className={`w-full py-1 border-none rounded-md text-dark100_light900 placeholder:text-dark-600 focus:ring-0 focus:outline-none focus:border-transparent h-10 
    ${isSelected ? "text-blue-500 body-semibold" : "text-dark100_light900"}`}
          value={searchCollaborator}
          onChange={handleSearch}
        />

        <Icon
          icon="hugeicons:add-team"
          className="text-dark100_light900 w-4 h-4"
        />
      </div>

      {/* Danh sách kết quả tìm kiếm */}
      {showDropdown && (
        <div className="absolute left-0 w-full mt-2 background-light900_dark200 border border-light500_dark400 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-3 py-2 hover:background-light500_dark400 hover:bg-opacity-75 cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.name}</p>
                </div>
              </div>
              <div className="w-5 h-5 border border-gray-400 rounded-full"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaboratorSearch;
