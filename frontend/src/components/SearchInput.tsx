import { Input } from "./ui/input";

const SearchInput = ({ text, setText }: any) => {
  return (
    <div>
      <Input
        placeholder="serach using symbl or name  🔍"
        className="px-4 my-4 rounded-xl"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchInput;
