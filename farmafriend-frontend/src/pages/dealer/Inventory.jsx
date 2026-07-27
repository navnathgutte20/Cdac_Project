import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { dealerService } from "../../services/dealerService";
import { productService } from "../../services/productService";

const Inventory = () => {
  const user = useSelector((state) => state.auth.user);

  const dealerId = user?.userId;

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    stockQuantity: "",
  });

  const loadInventory = async () => {
    if (!dealerId) {
      setLoading(false);
      return;
    }

    try {
      const res = await dealerService.getInventory(dealerId);

      console.log("Inventory Response :", res.data);

      if (Array.isArray(res.data)) {
        setInventory(res.data);
      } else if (Array.isArray(res.data.data)) {
        setInventory(res.data.data);
      } else if (Array.isArray(res.data.content)) {
        setInventory(res.data.content);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await productService.search({
        page: 0,
        size: 100,
      });

      if (res.data.data?.content) {
        setProducts(res.data.data.content);
      } else if (Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [dealerId]);

  const handleUpdate = async () => {
    if (!form.productId || !form.stockQuantity) {
      toast.error("Please select a product and enter stock quantity.");
      return;
    }

    try {
      await dealerService.updateStock({
        dealerId,
        productId: Number(form.productId),
        stockQuantity: Number(form.stockQuantity),
      });

      toast.success("Inventory updated successfully");

      setForm({
        productId: "",
        stockQuantity: "",
      });

      loadInventory();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update inventory"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader title="My Inventory" />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Update Inventory
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Product"
            value={form.productId}
            sx={{ minWidth: 250 }}
            onChange={(e) =>
              setForm({
                ...form,
                productId: e.target.value,
              })
            }
          >
            {products.map((product) => (
              <MenuItem
                key={product.productId}
                value={product.productId}
              >
                {product.productName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Stock Quantity"
            type="number"
            value={form.stockQuantity}
            onChange={(e) =>
              setForm({
                ...form,
                stockQuantity: e.target.value,
              })
            }
          />

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Update Stock
          </Button>
        </Box>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Dealer</TableCell>
              <TableCell align="right">Stock Quantity</TableCell>
              <TableCell align="right">Available Stock</TableCell>
              <TableCell align="right">Reserved Stock</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName}</TableCell>

                  <TableCell>{item.dealerName}</TableCell>

                  <TableCell align="right">
                    {item.stockQuantity}
                  </TableCell>

                  <TableCell align="right">
                    {item.availableStock}
                  </TableCell>

                  <TableCell align="right">
                    {item.reservedStock}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No inventory available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Inventory;