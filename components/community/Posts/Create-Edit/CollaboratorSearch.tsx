import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { ShortUserResponseDTO } from "@/lib/DTO/user";
import { getMyListBestFriend } from "@/lib/data/mine/dataBestFriend";
import { FriendResponseDTO } from "@/lib/DTO/friend";

const CollaboratorSearch = ({
  taggedUser,
  setTaggedUser
}: {
  taggedUser?: ShortUserResponseDTO[];
  setTaggedUser: React.Dispatch<React.SetStateAction<ShortUserResponseDTO[]>>;
}) => {
  const [filteredUsers, setFilteredUsers] = useState<ShortUserResponseDTO[]>(
    []
  );
  const [searchCollaborator, setSearchCollaborator] = useState("");
  const [listBestFriend, setListBestFriend] = useState<FriendResponseDTO[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCollaborator(value);
    setIsSelected(false); // Khi gõ lại, reset về trạng thái chưa chọn

    if (value.trim() === "") {
      setSearchCollaborator("");
      setShowDropdown(false);
      return;
    }

    const filtered = listBestFriend.filter(
      (user) =>
        (user.firstName + user.lastName)
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        user.nickName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelectUser = (user: ShortUserResponseDTO) => {
    const alreadyTagged = taggedUser?.some((u) => u._id === user._id);
    if (alreadyTagged) return;
    const name = "@" + user.firstName + " " + user.lastName;

    setTaggedUser((prev) => [...prev, user]);
    setSearchCollaborator(name);
    setIsSelected(true);
    setShowDropdown(false);
  };

  const fetchData = async () => {
    try {
      await getMyListBestFriend(setListBestFriend);
    } catch (err) {
      console.error("Failed to fetch data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      {taggedUser && taggedUser.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {taggedUser.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-accent-blue text-sm"
            >
              <span>
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={() => {
                  setTaggedUser((prev) =>
                    prev.filter((u) => u._id !== user._id)
                  );
                }}
              >
                <Icon icon="iconoir:cancel" width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Danh sách kết quả tìm kiếm */}
      {showDropdown && (
        <div className="absolute left-0 w-full mt-2 background-light900_dark200 border border-light500_dark400 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-3 py-2 hover:background-light500_dark400 hover:bg-opacity-75 cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full relative overflow-hidden">
                  <Image
                    src={
                      user.avatar !== ""
                        ? user.avatar
                        : "/assets/ava/default.png"
                    }
                    alt={user.nickName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.nickName}</p>
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
