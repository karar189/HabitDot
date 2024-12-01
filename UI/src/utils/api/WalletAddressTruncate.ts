const truncateAndMaskWalletAddress = (address) => {
    if(address){
    if (address.length <= 10) return address;
    return `${address.slice(0, 14)}.......${address.slice(-5)}`;
    }else{
      return address;
    }
  };
  export default truncateAndMaskWalletAddress;

