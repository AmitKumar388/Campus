import mongoose, { Schema } from "mongoose";

const AttendanceSessionSchema = new Schema({
  faculty: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: String, required: true },
  qrToken: { type: String, required: true }, // signed token for validation
  expiresAt: { type: Date, required: true }, // token expiry (5 min)
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

AttendanceSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto cleanup after expiry

export default mongoose.model("AttendanceSession", AttendanceSessionSchema);
