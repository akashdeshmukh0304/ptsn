import request from "supertest";
import app from "../app";

describe("Testing /api/v1/stocks", () => {
  it("should return error if the sku field is not passed in the URL", (done) => {
    request(app)
      .get("/api/v1/stocks")
      .expect(400)
      .end((err, res: any) => {
        if (err) return done(err);
        expect(res.error.text).toEqual("Error in input field");
        done();
      });
  });

  it("should return error if the sku is passed empty in the url", (done) => {
    request(app)
      .get("/api/v1/stocks?sku=")
      .expect(400)
      .end((err, res: any) => {
        if (err) return done(err);
        expect(res.error.text).toEqual("Error in input field");
        done();
      });
  });

  it("should return error if the sku is passed invalid in the url query param", (done) => {
    request(app)
      .get("/api/v1/stocks?sku=invalid")
      .expect(500)
      .end((err, res: any) => {
        if (err) return done(err);
        expect(res.error.text).toEqual(
          "Transactions not found for the given sku"
        );
        done();
      });
  });

  it("should should successfully return the data with ", (done) => {
    request(app)
      .get("/api/v1/stocks?sku=LTV719449/39/39")
      .expect(200)
      .end((err, res: any) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty("sku");
        expect(res.body.sku).toEqual("LTV719449/39/39");
        expect(res.body).toHaveProperty("qty");
        done();
      });
  });
});
