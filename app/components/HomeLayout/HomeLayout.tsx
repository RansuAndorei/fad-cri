import { Box, Flex } from "@mantine/core";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import classes from "./HomeLayout.module.css";

type Props = {
  children?: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <Flex direction={"column"} className={classes.container}>
      <Header />
      <Box className={classes.main}>{children}</Box>
      <Footer />
    </Flex>
  );
};

export default HomeLayout;
