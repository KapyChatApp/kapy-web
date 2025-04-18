import { getMyProfile } from "@/lib/data/mine/dataAdmin";
import { FriendProfileResponseDTO } from "@/lib/DTO/friend";
import { PostResponseDTO } from "@/lib/DTO/post";
import { UserResponseDTO } from "@/lib/DTO/user";
import {
  fetchDetailProfile,
  fetchUserPost
} from "@/lib/services/account.service";
import { AccountData } from "@/types/account";

export const getProfile = async (
  id: string,
  adminInfo: UserResponseDTO,
  setAccount: React.Dispatch<React.SetStateAction<AccountData | null>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const adminId = localStorage.getItem("adminId");
  if (!adminId) return;
  if (id === adminId) {
    setAccount({ type: "self", data: adminInfo });
  } else {
    try {
      const data: FriendProfileResponseDTO | null = await fetchDetailProfile(
        id,
        setError
      );
      if (data) {
        setAccount({ type: "friend", data });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }
};

export const getPostsOfUser = async (
  id: string,
  isMine: boolean,
  setPostData: React.Dispatch<React.SetStateAction<PostResponseDTO[] | null>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    const data: PostResponseDTO[] = await fetchUserPost(id, isMine, setError);
    if (data) setPostData(data);
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
};

export const handleGetAllDetail = async (
  id: string,
  adminInfo: UserResponseDTO,
  setAccount: React.Dispatch<React.SetStateAction<AccountData | null>>,
  setPostData: React.Dispatch<React.SetStateAction<PostResponseDTO[] | null>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const adminId = localStorage.getItem("adminId");
  if (!adminId) return;
  await Promise.all([
    getProfile(id, adminInfo, setAccount, setError),
    getPostsOfUser(id, id === adminId ? true : false, setPostData, setError)
  ]);
};
