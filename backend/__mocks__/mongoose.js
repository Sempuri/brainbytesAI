// __mocks__/mongoose.js
// Jest manual mock for mongoose to fully decouple tests from MongoDB

const chainable = (result) => ({
  sort: jest.fn().mockResolvedValue(result || []),
  select: jest.fn().mockResolvedValue(result || {}),
  exec: jest.fn().mockResolvedValue(result || {}),
});

const mockModel = jest.fn(() => ({
  save: jest.fn().mockResolvedValue({}),
}));
mockModel.findOne = jest.fn().mockResolvedValue(null);
mockModel.findById = jest.fn().mockResolvedValue(null);
mockModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
mockModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
mockModel.find = jest.fn().mockReturnValue(chainable([]));
mockModel.create = jest.fn().mockResolvedValue({});

module.exports = {
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  model: jest.fn(() => mockModel),
  Schema: class {},
};
