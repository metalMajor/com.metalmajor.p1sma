
def bytes_fromhex(s):
    return bytearray().fromhex(s)

def bytes_set(b, index, value, length):
    for i in range(length):
        b[index + i] = (value >> (8 * (length - 1 - i))) & 0xFF
    return b

def bytes_add(b, value, length):
    for i in range(length):
        b.append((value >> (8 * (length - 1 - i))) & 0xFF)
    return b

class emeterPacket:

    def __init__(self, serial_number):
        self.serial=bytes_fromhex("00000000")
        self.serial=bytes_set(self.serial, 0, serial_number,4)

        self.emHeader=bytearray("SMA", encoding="ascii")+bytes_fromhex("000004")+bytes_fromhex("02A000000001")+bytes_fromhex("FFFF00106069") # Data length @ 12(2)
        self.emId=bytes_fromhex("015D")+self.serial+bytes_fromhex("00000000") # Millis @ 6 (4)
        self.dataValid=False
        self.pwr=0
        self.values=[
  ["pwr_imp","1.1.4",bytes_fromhex("00010400"),10000.0,0],
  ["enrg_imp","1.1.8.1",bytes_fromhex("00010800"),3600000.0,0],
  ["pwr_exp","1.2.4",bytes_fromhex("00020400"),10000.0,0],
  ["enrg_exp","1.2.8.1",bytes_fromhex("00020800"),3600000.0,0],
  ["pwr_imp_r","1.3.4",bytes_fromhex("00030400"),10000.0,0],
  ["enrg_imp_r","1.3.8.1",bytes_fromhex("00030800"),3600000.0,0],
  ["pwr_exp-r","1.4.4",bytes_fromhex("00040400"),10000.0,0],
  ["enrg_exp_r","1.4.8.1",bytes_fromhex("00040800"),3600000.0,0],
  ["pwr_imp_a","1.1.9",bytes_fromhex("00090400"),10000.0,0],
  ["enrg_imp_a","1.9.8.1",bytes_fromhex("00090800"),3600000.0,0],
  ["pwr_exp_a","1.10.4",bytes_fromhex("000A0400"),10000.0,0],
  ["enrg_exp_a","1.10.8.1",bytes_fromhex("000A0800"),3600000.0,0],
  ["fact_tot","1.13.4",bytes_fromhex("000D0400"),1000.0,0],
  ["freq","1.14.4",bytes_fromhex("000e0400"),1000.0,0],
  
  ["l1_pwr_imp","1.21.4",bytes_fromhex("00150400"),10000.0,0],
  ["l1_enrg_imp","1.21.8",bytes_fromhex("00150800"),3600000.0,0],
  ["l1_pwr_exp","1.22.4",bytes_fromhex("00160400"),10000.0,0],
  ["l1_enrg_exp","1.22.8",bytes_fromhex("00160800"),3600000.0,0],
  ["l1_pwr_imp_r","1.23.4",bytes_fromhex("00170400"),10000.0,0],
  ["l1_enrg_imp_r","1.23.8",bytes_fromhex("00170800"),3600000.0,0],
  ["l1_pwr_exp_r","1.24.4",bytes_fromhex("00180400"),10000.0,0],
  ["l1_enrg_exp_r","1.24.8",bytes_fromhex("00180800"),3600000.0,0],
  ["l1_pwr_imp_a","1.29.4",bytes_fromhex("001D0400"),10000.0,0],
  ["l1_enrg_imp_a","1.29.8",bytes_fromhex("001D0800"),3600000.0,0],
  ["l1_pwr_exp_a","1.30.4",bytes_fromhex("001E0400"),10000.0,0],
  ["l1_enrg_exp_a","1.30.8",bytes_fromhex("001E0800"),3600000.0,0],
  ["amp_l1","1.31.4",bytes_fromhex("001F0400"),1000.0,0],
  ["volts_l1","1.32.4",bytes_fromhex("00200400"),1000.0,0],
  ["fact_l1","1.33.4",bytes_fromhex("00210400"),1000.0,0],
  
  ["l2_pwr_imp","1.41.4",bytes_fromhex("00290400"),10000.0,0],
  ["l2_enrg_imp","1.41.8",bytes_fromhex("00290800"),3600000.0,0],
  ["l2_pwr_exp","1.42.4",bytes_fromhex("002A0400"),10000.0,0],
  ["l2_enrg_exp","1.42.8",bytes_fromhex("002A0800"),3600000.0,0],
  ["l2_pwr_imp_r","1.43.4",bytes_fromhex("002B0400"),10000.0,0],
  ["l2_enrg_imp_r","1.43.8",bytes_fromhex("002B0800"),3600000.0,0],
  ["l2_pwr_exp_r","1.44.4",bytes_fromhex("002C0400"),10000.0,0],
  ["l2_enrg_exp_r","1.44.8",bytes_fromhex("002C0800"),3600000.0,0],
  ["l2_pwr_imp_a","1.49.4",bytes_fromhex("00310400"),10000.0,0],
  ["l2_enrg_imp_a","1.49.8",bytes_fromhex("00310800"),3600000.0,0],
  ["l2_pwr_exp_a","1.50.4",bytes_fromhex("00320400"),10000.0,0],
  ["l2_enrg_exp_a","1.50.8",bytes_fromhex("00320800"),3600000.0,0],
  ["amp_l2","1.51.4",bytes_fromhex("00330400"),1000.0,0],
  ["volts_l2","1.52.4",bytes_fromhex("00340400"),1000.0,0],
  ["fact_l2","1.53.4",bytes_fromhex("00350400"),1000.0,1000],
  
  ["l3_pwr_imp","1.61.4",bytes_fromhex("003D0400"),10000.0,0],
  ["l3_enrg_imp","1.61.8",bytes_fromhex("003D0800"),3600000.0,0],
  ["l3_pwr_exp","1.62.4",bytes_fromhex("003E0400"),10000.0,0],
  ["l3_enrg_exp","1.62.8",bytes_fromhex("003E0800"),3600000.0,0],
  ["l3_pwr_imp_r","1.63.4",bytes_fromhex("003F0400"),10000.0,0],
  ["l3_enrg_imp_r","1.63.8",bytes_fromhex("003F0800"),3600000.0,0],
  ["l3_pwr_exp_r","1.64.4",bytes_fromhex("00400400"),10000.0,0],
  ["l3_enrg_exp_r","1.64.8",bytes_fromhex("00400800"),3600000.0,0],
  ["l3_pwr_imp_a","1.69.4",bytes_fromhex("00450400"),10000.0,0],
  ["l3_enrg_imp_a","1.69.8",bytes_fromhex("00450800"),3600000.0,0],
  ["l3_pwr_exp_a","1.70.4",bytes_fromhex("00460400"),10000.0,0],
  ["l3_enrg_exp_a","1.70.8",bytes_fromhex("00460800"),3600000.0,0],
  ["amp_l3","1.71.4",bytes_fromhex("00470400"),1000.0,0],
  ["volts_l3","1.72.4",bytes_fromhex("00480400"),1000.0,0],
  ["fact_l3","1.73.4",bytes_fromhex("00490400"),1000.0,0]
  ]

    def update_values(self, measurements):
        for v in self.values:
            if v[0] in measurements:
                print(f"Updating {v[0]} to {measurements[v[0]]}")
                print(f"  Multiplier: {v[3]}, Length: {v[2][2]}")
                v[4]=self.num2bytes(measurements[v[0]]*v[3],v[2][2])
            else:
                v[4]=self.num2bytes(0 * v[3], v[2][2])
        self.dataValid=True

# def smr(topic,idx,payload_s,payload_b)
#  import json
#  var smv=json.load(payload_s)
#  for val : self.values
#   var v=smv.find(val[0])
#   if v != nil
#    val[4]=self.num2bytes(v*val[3],val[2][2])
#   else
#    if val[0] == "enrg_imp"
#     v=smv["enrg_imp_t1"]+smv["enrg_imp_t2"]
#    elif val[0] == "enrg_exp"
#     v=smv["enrg_exp_t1"]+smv["enrg_exp_t2"]
#    elif val[0] == "pwr_imp_a"
#     v=smv["pwr_imp"]
#    elif val[0] == "enrg_imp_a"
#     v=smv["enrg_imp_t1"]+smv["enrg_imp_t2"]
#    elif val[0] == "pwr_exp_a"
#     v=smv["pwr_exp"]
#    elif val[0] == "enrg_exp_a"
#     v=smv["enrg_exp_t1"]+smv["enrg_exp_t2"]

#    elif val[0] == "l1_enrg_imp"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l1_enrg_exp"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "l1_pwr_imp_a"
#     v=smv["l1_pwr_imp"]
#    elif val[0] == "l1_enrg_imp_a"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l1_pwr_exp_a"
#     v=smv["l1_pwr_exp"]
#    elif val[0] == "l1_enrg_exp_a"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "amp_l1"
#     v=(smv["l1_pwr_imp"]+smv["l1_pwr_exp"])*1000.0/smv["volts_l1"]


#    elif val[0] == "l2_enrg_imp"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l2_enrg_exp"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "l2_pwr_imp_a"
#     v=smv["l2_pwr_imp"]
#    elif val[0] == "l2_enrg_imp_a"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l2_pwr_exp_a"
#     v=smv["l2_pwr_exp"]
#    elif val[0] == "l2_enrg_exp_a"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "amp_l2"
#     v=(smv["l2_pwr_imp"]+smv["l2_pwr_exp"])*1000.0/smv["volts_l2"]

#    elif val[0] == "l3_enrg_imp"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l3_enrg_exp"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "l3_pwr_imp_a"
#     v=smv["l3_pwr_imp"]
#    elif val[0] == "l3_enrg_imp_a"
#     v=(smv["enrg_imp_t1"]+smv["enrg_imp_t2"])/3
#    elif val[0] == "l3_pwr_exp_a"
#     v=smv["l3_pwr_exp"]
#    elif val[0] == "l3_enrg_exp_a"
#     v=(smv["enrg_exp_t1"]+smv["enrg_exp_t2"])/3
#    elif val[0] == "amp_l3"
#     v=(smv["l3_pwr_imp"]+smv["l3_pwr_exp"])*1000.0/smv["volts_l3"]
#    end
#    if v != nil
#     val[4]=self.num2bytes(v*val[3],val[2][2])
#    end
#   end
#  end
#  global.pwr=smv["pwr_exp"]-smv["pwr_imp"]
#  self.dataValid=true
# end # smr

    def num2bytes(self, value,length): # only positive numbers length 1, 2, 4 or 8
        b=bytearray()
        if length<=4:
            b = bytes_add(b, int(value), length)
        elif length==8:
            b=bytes_fromhex("0000")
            b = bytes_add(b, int(value/65535), 4)
            # 3600000/65535 will limit accuracy to 20 Wh
            b+=bytes_fromhex("0000")
#           b.add(int(value/4294967296.0),-4)
#           b.add(int(value%4294967296.0),-4)
        else:
            print(value,length)
        return b

    def get_packet(self, time_ms):
        if self.dataValid:
            self.emId=bytes_set(self.emId, 6, int(time_ms), 4)
            dg=self.emHeader+self.emId
            dl=12
            for v in self.values:
                dg+=(v[2]+v[4])
                dl+=4+v[2][2]

            dg+=(bytes_fromhex("9000000002030452")+bytes_fromhex("00000000"))
            dl+=8
            dg = bytes_set(dg, 12,dl,2)
            return dg
        else:
            return None