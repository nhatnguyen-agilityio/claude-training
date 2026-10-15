import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const faqList = [
  {
    id: 1,
    question: 'What types of furniture do you offer?',
    answer:
      'Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.',
  },
  {
    id: 2,
    question: 'Do you offer international shipping?',
    answer:
      'Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.',
  },
  {
    id: 3,
    question: 'What is your return policy?',
    answer:
      'Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.',
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer:
      'Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.',
  },
];

const Faq = () => {
  return (
    <div className="mt-15 container">
      <p className="text-left text-xl font-bold md:text-2xl lg:text-4xl">
        We have got the answers to your questions
      </p>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-1 border-b-1"
        defaultValue="item-1"
      >
        {faqList.map((item) => (
          <AccordionItem
            key={item.id}
            value={`item-${item.id}`}
            className="py-4"
          >
            <AccordionTrigger>
              <div className="flex text-base md:text-xl md:font-semibold lg:text-2xl lg:font-medium">
                <p className="w-12 flex justify-center items-center">
                  {item.id}
                </p>
                <p>{item.question}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-left ml-12 lg:text-lg md:font-normal">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
