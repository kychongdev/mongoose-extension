import mongoose, { CallbackError } from "mongoose";


export const softDelete = (schema: mongoose.Schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  schema.pre(
    ["find", "countDocuments", "findOne"],
    async function (this, next: (err?: CallbackError) => void) {
      if (this.getFilter().isDeleted === true) {
        return next();
      }
      this.setQuery({ ...this.getFilter(), isDeleted: false });
      next();
    },
  );

  schema.static("findSoftDeleted", async function () {
    return this.find({ isDeleted: true });
  });
};
