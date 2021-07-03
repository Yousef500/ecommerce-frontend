import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      if (userInfo && userInfo.isAdmin) {
        history.push(`/admin/products/?keyword=${keyword}&page=1`);
      } else {
        history.push(`/?keyword=${keyword}&page=1`);
      }
    } else {
      history.push(history.location.pathname);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex ms-2 me-2 mt-2">
      <Form.Control
        placeholder="Search Products"
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="me-xs-2 ms-xs-5 rounded border border-info text-dark"
      ></Form.Control>

      <Button type="submit" variant="outline-info rounded" className="p-2 ms-1">
        Submit
      </Button>
    </Form>
  );
};

export default SearchBox;
