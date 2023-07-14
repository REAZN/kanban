"use client";

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
import { Plus } from "lucide-react";

import { Testy } from "@/components/board/Testy";
import { useBoardStore } from "@/store";

type List = RouterOutputs["list"]["getAll"][0];

const Board: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  //Temp SSR fix...
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  //Temp SSR fix...
  useEffect(() => {
    setIsBrowser(typeof window !== "undefined" ? true : false);
  }, []);

  const { updateListPos, setLists, addList, lists } = useBoardStore();

  const { data: listsData, refetch: refetchLists } = api.list.getAll.useQuery(
    {
      boardId: String(router.query.board),
      withTasks: true,
    },
    {
      enabled: sessionData?.user !== undefined && router.query.board !== null,
    }
  );

  const list = api.list.updatePos.useMutation({
    onSuccess: () => {
      console.log("done!");
      void refetchLists();
    },
    onMutate: (data) => {
      console.log(data);
    },
  });

  const task = api.task.updatePos.useMutation({
    onSuccess: () => {
      console.log("done!");
      void refetchLists();
    },
    onMutate: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    setLists(listsData || []);
  }, [setLists, listsData]);

  const createList = api.list.create.useMutation({
    onSuccess: () => {
      void refetchLists();
    },
    onMutate: (data) => {
      addList({
        boardId: data.boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: String(Math.random()),
        name: data.name,
      } as List);
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    console.log("lists", lists);
    console.log(
      `destination: ${result.destination.index},
       source: ${result.source.index},
       draggableId: ${result.draggableId} ${JSON.stringify(result.source)}`
    );

    if (result.type === "list") {
      list.mutate({
        boardId: String(router.query.board),
        listId: result.draggableId,
        newPosition: result.destination.index,
      });
      updateListPos(
        result.draggableId,
        result.destination.index,
        result.source.index
      );
    }

    if (result.type === "task") {
      task.mutate({
        boardId: String(router.query.board),
        listId: "clj30rn6h0019v7fgcsyr9047",
        taskId: result.draggableId,
        newPosition: result.destination.index,
      });
    }
  };

  return (
    <>
      <Head>
        {/* TODO global title prefix */}
        <title>Kanban - Board</title>
      </Head>
      <Header />
      <section className="m-8 mt-20 flex flex-row">
        {isBrowser && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId={String(router.query.board)}
              direction="horizontal"
              type="list"
            >
              {(provided) => (
                <div
                  className="my-5 flex"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {lists?.map((list, index) => (
                    <List
                      key={list.id}
                      list={list}
                      index={index}
                      refresh={refetchLists}
                      className="mx-2"
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <button
          className="justify-left mt-1 flex h-fit w-64 items-center gap-2 rounded-md py-1.5 pl-1 text-sm hover:bg-accent"
          onClick={() =>
            createList.mutate({
              boardId: String(router.query.board),
              name: "New List",
            })
          }
        >
          <Plus className="h-4 w-4 shrink-0 opacity-50" />
          <span className="opacity-50">New</span>
        </button>
      </section>
    </>
  );
};

export default Board;
