import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { SlActionUndo } from "react-icons/sl";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import data from "../data.json";
import { Button } from "./ui/button";

function Article() {
  const { id } = useParams();
  const article = data.find((item) => item.id === parseInt(id, 10));

  if (!article) {
    return <div>Article not found</div>;
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col h-full items-center justify-center w-[90%] mx-3">
        <div className="relative grid grid-cols-1 grid-rows-10 place-items-center h-full   p-[2rem]">
          <SlActionUndo
            className="absolute top-10 right-8 h-4 w-4"
            onClick={() => window.history.back()}
          />
          <h1 className="font-extrabold text-4xl row-span-1 ">
            {article.title}
          </h1>

          <Alert className="w-[80%] md:w-1/2 row-span-1">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>You did it!</AlertTitle>
            <AlertDescription>
              You are 40% ahead of people who don't read.
            </AlertDescription>
          </Alert>
          <ReactMarkdown className="text-lg row-span-7 mt-2 max-h-[63vh] overflow-y-auto w-[90%]">
            {article.content}
          </ReactMarkdown>
          <div className=" justify-end row-span-1">
            <Button className="" variant="default" size="lg">
              Finish Reading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
