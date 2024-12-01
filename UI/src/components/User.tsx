const Item = ({ item, image, type }: any) => (
  <div className="flex flex-row justify-between items-center px-3 py-3 w-full">
    <div className="flex flex-col items-center justify-center">
      <img src={image} alt={item.username} className="w-[40px] h-[40px] rounded-full" />
    </div>
    <div className="flex flex-col items-start justify-start w-[60%]">
      <p className="text-[14px] font-bold">{item.username}</p>
      <div className="flex flex-row justify-between items-center">
        <p className="text-[12px]">
          {type === "Voting" || type === 4 ? (item.Player?.Submission?.NumberOfVotes ?? 0) : (item.value.toFixed(2) ?? 0)} |
        </p>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center w-[20%]">
      <p className="text-[16px] font-bold">
        {type === "Voting" || type === 4 ? (item.Player?.Submission?.NumberOfVotes ?? 0) : (item.value.toFixed(2) ?? 0)}
      </p>
    </div>
  </div>
);

export default Item;
