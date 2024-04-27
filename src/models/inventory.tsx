export type School = {
  id: number;
  name: string;
};

export type POSCenter = {
  id: number;
  name: string;
  schoolName: string;
  schoolId: number;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  provider:
    | string
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5Brands'
    | 'FontAwesome6'
    | 'Fontisto'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'SimpleLineIcons'
    | 'Zocial'
    | 'Octicons';
  image: string;
  frequency: number;
};

export type InventoryItem = {
  id: number;
  name: string;
  category: Category;
  price: number;
  pos: POSCenter;
  quantity: number;
  frequency: number;
};

export type OrderItem = {
  id: number;
  name: string;
  category: Category;
  price: number;
  orderId?: number;
  quantity: number;
};

export type Wallet = {
  id: number;
  cardNo: string;
  balance: number;
  maximumDailyLimit: number;
  enableDailyLimit: boolean;
  status: string | 'PENDING' | 'SUSPENDED' | 'ACTIVE' | 'DISABLED';
};
export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  wallet: Wallet;
  school: School;
  classId: number;
  className: string;
};

export type Order = {
  id?: number;
  wallet: Wallet;
  amount: number;
  items: Array<OrderItem>;
  date: string;
  status: string | 'Pending' | 'Processed' | 'Cancelled' | 'Failed';
  pos: POSCenter;
};
