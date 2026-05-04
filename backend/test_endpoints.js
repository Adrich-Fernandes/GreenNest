/**
 * GreenNest API Endpoint Test Suite
 * Tests all endpoints: products, user/cart, orders, gardeners, queries, admin
 */

const BASE_URL = "http://localhost:8000";

let testProductId = null;
let testGardenerId = null;
let testQueryId = null;
let testClerkId = "test_clerk_" + Date.now();

// Fake JWT token with a clerkId sub claim (the middleware decodes without verification)
function makeFakeToken(clerkId) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: clerkId, iat: Math.floor(Date.now() / 1000) })).toString("base64url");
  const sig = "fake_signature";
  return `${header}.${payload}.${sig}`;
}

const fakeToken = makeFakeToken(testClerkId);

const results = [];

async function request(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    let data;
    try { data = await res.json(); } catch { data = {}; }
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.message } };
  }
}

function log(category, name, expected, result) {
  const pass = result.status === expected;
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name} → HTTP ${result.status} (expected ${expected})`);
  if (!pass) {
    console.log(`   Response:`, JSON.stringify(result.data).slice(0, 200));
  }
  results.push({ category, name, expected, actual: result.status, pass, data: result.data });
}

async function runTests() {
  console.log("\n🌿 GreenNest API Endpoint Test Suite\n" + "=".repeat(50));

  // ─── 1. HEALTH CHECK ───────────────────────────────────────────────────────
  console.log("\n📌 Health Check");
  log("Health", "GET /", 200, await request("GET", "/"));

  // ─── 2. PRODUCTS (Public) ──────────────────────────────────────────────────
  console.log("\n📌 Products");

  const getAllRes = await request("GET", "/api/products/allProducts");
  log("Products", "GET /api/products/allProducts", 200, getAllRes);
  if (getAllRes.data?.data?.length > 0) {
    testProductId = getAllRes.data.data[0]._id;
    console.log(`   ℹ️  Using product ID: ${testProductId}`);
  }

  if (testProductId) {
    log("Products", `GET /api/products/product/${testProductId}`, 200,
      await request("GET", `/api/products/product/${testProductId}`));
  }

  log("Products", "GET /api/products/product/invalid-id (bad ID)", 400,
    await request("GET", "/api/products/product/invalid-id-123"));

  log("Products", "GET /api/products/product/000000000000000000000000 (not found)", 404,
    await request("GET", "/api/products/product/000000000000000000000000"));

  // Test creating a product
  const newProduct = {
    name: "Test Plant",
    nursery: "Test Nursery",
    price: 299,
    category: "Indoor",
    stock: 10,
    description: "A test plant for endpoint testing",
    careInstructions: "Water daily",
    images: ["https://example.com/plant.jpg"],
    rating: 4.5
  };
  const createProductRes = await request("POST", "/api/products/insertProduct", newProduct);
  log("Products", "POST /api/products/insertProduct", 201, createProductRes);
  let createdProductId = createProductRes.data?.data?._id;

  if (createdProductId) {
    log("Products", `PUT /api/products/updateProduct/${createdProductId}`, 200,
      await request("PUT", `/api/products/updateProduct/${createdProductId}`, { price: 399 }));

    log("Products", `DELETE /api/products/deleteProduct/${createdProductId}`, 200,
      await request("DELETE", `/api/products/deleteProduct/${createdProductId}`));
  }

  // ─── 3. USER SYNC ──────────────────────────────────────────────────────────
  console.log("\n📌 User Sync");
  log("User", "POST /api/user/sync - missing fields", 400,
    await request("POST", "/api/user/sync", {}));

  const syncRes = await request("POST", "/api/user/sync", {
    clerkId: testClerkId,
    name: "Test User",
    email: "testuser@greennest.test"
  });
  log("User", "POST /api/user/sync (create new user)", 200, syncRes);

  // Sync again (update)
  log("User", "POST /api/user/sync (update existing user)", 200,
    await request("POST", "/api/user/sync", {
      clerkId: testClerkId,
      name: "Test User Updated",
      email: "testuser@greennest.test"
    }));

  // ─── 4. USER PROFILE & AUTH (Protected) ────────────────────────────────────
  console.log("\n📌 User Profile & Cart (Protected)");

  log("User", "GET /api/user/me - no token (401)", 401,
    await request("GET", "/api/user/me"));

  log("User", "GET /api/user/me - valid token", 200,
    await request("GET", "/api/user/me", null, fakeToken));

  // ─── 5. CART (Protected) ───────────────────────────────────────────────────
  console.log("\n📌 Cart (Protected)");

  log("Cart", "GET /api/cart/ - no token", 401, await request("GET", "/api/cart/"));
  log("Cart", "GET /api/cart/ - valid token", 200, await request("GET", "/api/cart/", null, fakeToken));

  if (testProductId) {
    log("Cart", "POST /api/cart/add", 200,
      await request("POST", "/api/cart/add", { productId: testProductId, quantity: 2 }, fakeToken));

    log("Cart", `PUT /api/cart/update/${testProductId}`, 200,
      await request("PUT", `/api/cart/update/${testProductId}`, { qty: 5 }, fakeToken));

    log("Cart", `DELETE /api/cart/remove/${testProductId}`, 200,
      await request("DELETE", `/api/cart/remove/${testProductId}`, null, fakeToken));
  }

  // ─── 6. ADDRESSES (Protected) ──────────────────────────────────────────────
  console.log("\n📌 Addresses (Protected)");

  log("Address", "GET /api/user/addresses", 200,
    await request("GET", "/api/user/addresses", null, fakeToken));

  const addAddrRes = await request("POST", "/api/user/addresses", {
    fullname: "Test User",
    phone: "9999999999",
    addressline1: "123 Test Street",
    addressline2: "Near Test Park",
    city: "Test City",
    state: "TS",
    pincode: "000000",
    isDefault: true
  }, fakeToken);
  log("Address", "POST /api/user/addresses", 200, addAddrRes);

  const addedAddrId = addAddrRes.data?.data?._id;
  if (addedAddrId) {
    log("Address", `DELETE /api/user/addresses/${addedAddrId}`, 200,
      await request("DELETE", `/api/user/addresses/${addedAddrId}`, null, fakeToken));
  }

  // ─── 7. ORDERS ─────────────────────────────────────────────────────────────
  console.log("\n📌 Orders (Protected)");

  log("Orders", "GET /api/orders/my-orders - no token", 401, await request("GET", "/api/orders/my-orders"));
  log("Orders", "GET /api/orders/my-orders - valid token", 200,
    await request("GET", "/api/orders/my-orders", null, fakeToken));

  // Place an order: placeOrder reads from the user's cart, so we add to cart first
  let placedOrderId = null;
  if (testProductId) {
    // Add item to cart first (cart must not be empty for placeOrder)
    await request("POST", "/api/cart/add", { productId: testProductId, quantity: 1 }, fakeToken);

    const orderRes = await request("POST", "/api/orders/place", {
      address: {
        fullname: "Test User",
        phone: "9999999999",
        addressline1: "123 Test Street",
        city: "Test City",
        state: "TS",
        pincode: "000000"
      },
      paymentMethod: "cash"
    }, fakeToken);
    log("Orders", "POST /api/orders/place (from cart)", 201, orderRes);
    placedOrderId = orderRes.data?.data?._id || orderRes.data?.order?._id;

    if (placedOrderId) {
      log("Orders", `POST /api/orders/${placedOrderId}/return (not eligible yet)`, 400,
        await request("POST", `/api/orders/${placedOrderId}/return`, { reason: "Testing" }, fakeToken));

      log("Orders", `POST /api/orders/${placedOrderId}/cancel`, 200,
        await request("POST", `/api/orders/${placedOrderId}/cancel`, {}, fakeToken));
    }
  }

  // ─── 8. GARDENERS (Public) ─────────────────────────────────────────────────
  console.log("\n📌 Gardeners");

  const gardenersRes = await request("GET", "/api/gardener/");
  log("Gardener", "GET /api/gardener/", 200, gardenersRes);
  if (gardenersRes.data?.data?.length > 0) {
    testGardenerId = gardenersRes.data.data[0]._id;
    console.log(`   ℹ️  Using gardener ID: ${testGardenerId}`);
  }

  if (testGardenerId) {
    log("Gardener", `GET /api/gardener/profile/${testGardenerId}`, 200,
      await request("GET", `/api/gardener/profile/${testGardenerId}`));
  }

  // Add a gardener via admin route
  const addGardenerRes = await request("POST", "/api/gardener/admin-add", {
    name: "Test Gardener",
    clerkId: "gardener_clerk_" + Date.now(),
    email: "gardener@test.com",
    phone: "9999999999",
    experience: 5,
    specialization: ["Indoor Plants"],
    location: "Test City",
    pricePerHour: 500,
    bio: "Test bio"
  });
  log("Gardener", "POST /api/gardener/admin-add", 201, addGardenerRes);
  const newGardenerId = addGardenerRes.data?.data?._id;

  if (newGardenerId) {
    log("Gardener", `PUT /api/gardener/admin-update/${newGardenerId}`, 200,
      await request("PUT", `/api/gardener/admin-update/${newGardenerId}`, { pricePerHour: 600 }));

    // Book appointment with test user
    const bookRes = await request("POST", "/api/gardener/book-appointment", {
      gardenerId: newGardenerId,
      userId: testClerkId,
      customerName: "Test User",
      location: "123 Test St, Test City",
      serviceRequired: "Garden Maintenance",
      price: 500,
      date: "2026-06-01",
      time: "10:00 AM",
      duration: "2 hours",
      note: "Please bring tools"
    }, fakeToken);
    log("Gardener", "POST /api/gardener/book-appointment", 201, bookRes);

    // Get user appointments
    log("Gardener", `GET /api/gardener/my-appointments/${testClerkId}`, 200,
      await request("GET", `/api/gardener/my-appointments/${testClerkId}`, null, fakeToken));

    // Delete the test gardener
    log("Gardener", `DELETE /api/gardener/${newGardenerId}`, 200,
      await request("DELETE", `/api/gardener/${newGardenerId}`));
  }

  // ─── 9. QUERIES ────────────────────────────────────────────────────────────
  console.log("\n📌 Queries");

  // Controller expects: name, email, query (not 'message' or 'subject')
  const submitQueryRes = await request("POST", "/api/queries/submit", {
    clerkId: testClerkId,
    name: "Test User",
    email: "testuser@greennest.test",
    query: "This is a test query for endpoint testing."
  });
  log("Queries", "POST /api/queries/submit", 201, submitQueryRes);
  testQueryId = submitQueryRes.data?.data?._id;

  log("Queries", "GET /api/queries/all (Admin)", 200, await request("GET", "/api/queries/all"));
  log("Queries", `GET /api/queries/user/${testClerkId}`, 200,
    await request("GET", `/api/queries/user/${testClerkId}`));

  if (testQueryId) {
    // Controller expects adminReply field
    log("Queries", `PATCH /api/queries/${testQueryId}/reply`, 200,
      await request("PATCH", `/api/queries/${testQueryId}/reply`, {
        adminReply: "Thank you for reaching out. This is a test reply."
      }));

    log("Queries", `PATCH /api/queries/${testQueryId}/status`, 200,
      await request("PATCH", `/api/queries/${testQueryId}/status`, { status: "Resolved" }));

    log("Queries", `PATCH /api/queries/${testQueryId}/reopen`, 200,
      await request("PATCH", `/api/queries/${testQueryId}/reopen`));

    log("Queries", `PATCH /api/queries/${testQueryId}/update-request`, 200,
      await request("PATCH", `/api/queries/${testQueryId}/update-request`, {
        message: "Updated query message."
      }));
  }

  // ─── 10. ADMIN ─────────────────────────────────────────────────────────────
  console.log("\n📌 Admin");
  log("Admin", "GET /api/admin/stats", 200, await request("GET", "/api/admin/stats"));

  // ─── 11. 404 HANDLER ───────────────────────────────────────────────────────
  console.log("\n📌 Error Handling");
  log("Error", "GET /api/nonexistent → 404", 404, await request("GET", "/api/nonexistent"));

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed out of ${results.length} tests\n`);

  if (failed > 0) {
    console.log("❌ FAILED TESTS:");
    results.filter(r => !r.pass).forEach(r => {
      console.log(`   - [${r.category}] ${r.name}`);
      console.log(`     Expected: ${r.expected}, Got: ${r.actual}`);
      console.log(`     Response: ${JSON.stringify(r.data).slice(0, 300)}`);
    });
  }
}

runTests().catch(console.error);
