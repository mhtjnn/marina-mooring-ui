import React from 'react';

const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DateTemplateProps {
  date: Date;
}

const dateTemplate: React.FC<DateTemplateProps> = ({ date }) => {
  return (
    <>
      {dayNamesShort[date.getDay()]}, {monthNamesShort[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
    </>
  );
};

export default dateTemplate;