import { type NextPage } from "next";
import Head from "next/head";
import { Header, List } from "@/components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api, type RouterOutputs } from "@/utils/api";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import {Plus} from "lucide-react";

type List = RouterOutputs["list"]["getAll"][0];

const Board: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();


  const { data: lists, refetch: refetchLists } = api.list.getAll.useQuery(
    {
      boardId: String(router.query.board),
    },
    {
      enabled: sessionData?.user !== undefined && router.query.board !== null,
    }
  );

  // const [lists, setLists] = useState<List[] | undefined>();

  // useEffect(() => {
  //   setLists(listsData);
  // }, [listsData]);

  const { data: tasks, refetch: refetchTasks } = api.task.getAll.useQuery({
    boardId: String(router.query.board),
  });

  const createList = api.list.create.useMutation({
    onSuccess: () => {
      void refetchLists();
    },
  });


  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // let newList = lists;
    // let dragItem = newList?[(result.source.droppableId)].

    // console.log("result", result);
    console.log("lists", lists);
    console.log(
      `destination: ${result.destination.index}, source: ${result.source.index}, draggableId: ${result.draggableId}`
    );

    // updateTask.mutate({
    //   id: result.draggableId,
    // });
  };

  return (
    <>
      <Head>
        <title>Kanban - Board</title>
        <meta name="description" content="Kanban" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="flex flex-row m-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={String(router.query.board)} direction="horizontal" type="list">
            {(provided) => (
              <div className="flex my-5 gap-4" {...provided.droppableProps} ref={provided.innerRef}>
                {lists?.map((list, index) => (
                  <List key={list.id} list={list} index={index}/>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          className="w-64 h-fit text-sm flex gap-2 mt-1 hover:bg-accent flex items-center justify-left pl-1 py-1.5 rounded-md"
          onClick={() =>
            createList.mutate({
              boardId: String(router.query.board),
              name: "New List",
            })
          }
        >
          <Plus className="h-4 w-4 shrink-0 opacity-50"/>
          <span className="opacity-50">New</span>
        </button>
      </section>
    </>
  );
};

export default Board;
