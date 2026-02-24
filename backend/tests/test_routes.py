def test_list_subscriptions_empty(client):
    res = client.get("/api/subscriptions")
    assert res.status_code == 200
    assert res.json == []

def test_create_and_get_subscription(client):
    payload = {
        "name": "Spotify",
        "cost": 9.99,
        "billing_cycle": "monthly",
        "next_billing_date": "2024-02-01",
        "category": "Music"
    }
    res_post = client.post("/api/subscriptions", json=payload)
    assert res_post.status_code == 201
    assert res_post.json["id"] is not None
    assert res_post.json["name"] == "Spotify"
    
    sub_id = res_post.json["id"]
    res_get = client.get(f"/api/subscriptions/{sub_id}")
    assert res_get.status_code == 200
    assert res_get.json["name"] == "Spotify"

def test_create_subscription_invalid_data(client):
    payload = {
        "name": "Spotify",
        "cost": -10,  # Invalid cost
        "billing_cycle": "monthly",
        "next_billing_date": "2024-02-01",
        "category": "Music"
    }
    res = client.post("/api/subscriptions", json=payload)
    assert res.status_code == 400
    assert "error" in res.json
    assert res.json["error"] == "Validation Error"

def test_update_subscription(client):
    payload = {
        "name": "Spotify",
        "cost": 9.99,
        "billing_cycle": "monthly",
        "next_billing_date": "2024-02-01",
        "category": "Music"
    }
    res_post = client.post("/api/subscriptions", json=payload)
    sub_id = res_post.json["id"]

    res_put = client.put(f"/api/subscriptions/{sub_id}", json={"cost": 12.99})
    assert res_put.status_code == 200
    assert res_put.json["cost"] == 12.99
