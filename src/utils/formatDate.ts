const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("br-BR" , {era: "long"}).format(date); 
}
  
export default formatDate;
  