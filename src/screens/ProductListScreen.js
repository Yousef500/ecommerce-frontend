import React, { useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  createProduct,
  deleteProduct,
  listProducts
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  let keyword = history.location.search;

  const productList = useSelector((state) => state.productList);
  const { products, loading, error, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (createSuccess) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts(keyword));
    }
  }, [
    dispatch,
    history,
    userInfo,
    deleteSuccess,
    createSuccess,
    createdProduct,
    keyword,
  ]);

  const deleteHandler = (id, name) => {
    let confirmDelete = window.confirm(
      `Are you sure you want to delete the product: ${name} ?`
    );
    if (confirmDelete) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <SearchBox />

        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {createLoading && <Loader />}
      {createError && <Message variant="danger">{createError}</Message>}

      {deleteLoading && <Loader />}
      {deleteError && <Message variant="danger">{deleteError}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td>{prod._id}</td>
                  <td>{prod.name}</td>
                  <td>{prod.price}</td>
                  <td>{prod.category}</td>
                  <td>{prod.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${prod._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>

                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(prod._id, prod.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} keword={keyword} pages={pages} isAdmin={true} />
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
