import Markdown from "react-markdown";

const Index = ({ text }) => {
  return (
    <div className="flex justify-center mt-6 text-sm ">
      <div className="block rounded-lg border border-secondary-600 bg-white shadow-secondary-1 dark:text-white dark:bg-sky-900">
        <div className="border-b-2 border-neutral-100 px-6 py-3 text-surface dark:border-white/10 dark:text-white">
          AI摘要
        </div>
        <div className="p-6 leading-normal">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default Index;
