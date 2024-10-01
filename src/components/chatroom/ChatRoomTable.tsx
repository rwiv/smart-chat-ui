import {ChatRoom} from "@/graphql/types.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {useNavigate} from "react-router";

interface ChatRoomTableProps {
  chatRooms: ChatRoom[];
}

export function ChatRoomTable({ chatRooms }: ChatRoomTableProps) {

  const navigate = useNavigate();

  const onClickRow = (chatRoom: ChatRoom) => {
    navigate(`/chat-rooms/${chatRoom.id}`);
  };

  return (
    <div css={{width: "100%"}}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/0">
            <TableHead className="text-left" css={{width: "10rem"}}>이름</TableHead>
            <TableHead className="text-center">참여인원</TableHead>
            <TableHead className="text-center">생성자</TableHead>
            <TableHead className="text-center">생성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatRooms.map(chatRoom => (
            <TableRow
              key={chatRoom.id}
              className="border-0"
              css={{height: "3rem", cursor: "pointer"}}
              onClick={() => onClickRow(chatRoom)}
            >
              <TableCell className="text-left">{chatRoom.title}</TableCell>
              <TableCell className="text-center">{chatRoom.userCnt}</TableCell>
              <TableCell className="text-center">{chatRoom.createdBy.nickname}</TableCell>
              <TableCell className="text-center">{chatRoom.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
