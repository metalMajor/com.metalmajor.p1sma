
function bytesFromHex(s) {
  return Buffer.from(s, 'hex');
}

function bytesSet(b, index, value, length) {
  const out = Buffer.from(b);
  for (let i = 0; i < length; i++) {
    out[index + i] = (value >> (8 * (length - 1 - i))) & 0xff;
  }
  return out;
}

function bytesAdd(b, value, length) {
  const buf = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    buf[i] = (value >> (8 * (length - 1 - i))) & 0xff;
  }
  return Buffer.concat([Buffer.from(b), buf]);
}

class EmeterPacketizer {
  constructor(serial_number) {
    this.serial = bytesFromHex('00000000');
    this.serial = bytesSet(this.serial, 0, serial_number, 4);

    this.emHeader = Buffer.concat([
      Buffer.from('SMA', 'ascii'),
      bytesFromHex('000004'),
      bytesFromHex('02A000000001'),
      bytesFromHex('FFFF00106069'), // Data length @ 12(2)
    ]);

    this.emId = Buffer.concat([
      bytesFromHex('015D'),
      this.serial,
      bytesFromHex('00000000'), // Millis @ 6 (4)
    ]);

    this.dataValid = false;
    this.pwr = 0;
    this.values = [
      ["pwr_imp", "1.1.4", bytesFromHex("00010400"), 10.0, Buffer.alloc(0)],
      ["enrg_imp", "1.1.8.1", bytesFromHex("00010800"), 3600000.0, Buffer.alloc(0)],
      ["pwr_exp", "1.2.4", bytesFromHex("00020400"), 10.0, Buffer.alloc(0)],
      ["enrg_exp", "1.2.8.1", bytesFromHex("00020800"), 3600000.0, Buffer.alloc(0)],
      // ["pwr_imp_r", "1.3.4", bytesFromHex("00030400"), 10.0, Buffer.alloc(0)],
      // ["enrg_imp_r", "1.3.8.1", bytesFromHex("00030800"), 3600000.0, Buffer.alloc(0)],
      // ["pwr_exp-r", "1.4.4", bytesFromHex("00040400"), 10.0, Buffer.alloc(0)],
      // ["enrg_exp_r", "1.4.8.1", bytesFromHex("00040800"), 3600000.0, Buffer.alloc(0)],
      // ["pwr_imp_a", "1.1.9", bytesFromHex("00090400"), 10.0, Buffer.alloc(0)],
      // ["enrg_imp_a", "1.9.8.1", bytesFromHex("00090800"), 3600000.0, Buffer.alloc(0)],
      // ["pwr_exp_a", "1.10.4", bytesFromHex("000A0400"), 10.0, Buffer.alloc(0)],
      // ["enrg_exp_a", "1.10.8.1", bytesFromHex("000A0800"), 3600000.0, Buffer.alloc(0)],
      // ["fact_tot", "1.13.4", bytesFromHex("000D0400"), 1000.0, Buffer.alloc(0)],
      ["freq", "1.14.4", bytesFromHex("000e0400"), 1000.0, Buffer.alloc(0)],

      ["l1_pwr_imp", "1.21.4", bytesFromHex("00150400"), 10.0, Buffer.alloc(0)],
      ["l1_enrg_imp", "1.21.8", bytesFromHex("00150800"), 3600000.0, Buffer.alloc(0)],
      ["l1_pwr_exp", "1.22.4", bytesFromHex("00160400"), 10.0, Buffer.alloc(0)],
      ["l1_enrg_exp", "1.22.8", bytesFromHex("00160800"), 3600000.0, Buffer.alloc(0)],
      // ["l1_pwr_imp_r", "1.23.4", bytesFromHex("00170400"), 10.0, Buffer.alloc(0)],
      // ["l1_enrg_imp_r", "1.23.8", bytesFromHex("00170800"), 3600000.0, Buffer.alloc(0)],
      // ["l1_pwr_exp_r", "1.24.4", bytesFromHex("00180400"), 10.0, Buffer.alloc(0)],
      // ["l1_enrg_exp_r", "1.24.8", bytesFromHex("00180800"), 3600000.0, Buffer.alloc(0)],
      // ["l1_pwr_imp_a", "1.29.4", bytesFromHex("001D0400"), 10.0, Buffer.alloc(0)],
      // ["l1_enrg_imp_a", "1.29.8", bytesFromHex("001D0800"), 3600000.0, Buffer.alloc(0)],
      // ["l1_pwr_exp_a", "1.30.4", bytesFromHex("001E0400"), 10.0, Buffer.alloc(0)],
      // ["l1_enrg_exp_a", "1.30.8", bytesFromHex("001E0800"), 3600000.0, Buffer.alloc(0)],
      ["amp_l1", "1.31.4", bytesFromHex("001F0400"), 1000.0, Buffer.alloc(0)],
      ["volts_l1", "1.32.4", bytesFromHex("00200400"), 1000.0, Buffer.alloc(0)],
      //      ["fact_l1", "1.33.4", bytesFromHex("00210400"), 1000.0, Buffer.alloc(0)],

      ["l2_pwr_imp", "1.41.4", bytesFromHex("00290400"), 10.0, Buffer.alloc(0)],
      ["l2_enrg_imp", "1.41.8", bytesFromHex("00290800"), 3600000.0, Buffer.alloc(0)],
      ["l2_pwr_exp", "1.42.4", bytesFromHex("002A0400"), 10.0, Buffer.alloc(0)],
      ["l2_enrg_exp", "1.42.8", bytesFromHex("002A0800"), 3600000.0, Buffer.alloc(0)],
      // ["l2_pwr_imp_r", "1.43.4", bytesFromHex("002B0400"), 10.0, Buffer.alloc(0)],
      // ["l2_enrg_imp_r", "1.43.8", bytesFromHex("002B0800"), 3600000.0, Buffer.alloc(0)],
      // ["l2_pwr_exp_r", "1.44.4", bytesFromHex("002C0400"), 10.0, Buffer.alloc(0)],
      // ["l2_enrg_exp_r", "1.44.8", bytesFromHex("002C0800"), 3600000.0, Buffer.alloc(0)],
      // ["l2_pwr_imp_a", "1.49.4", bytesFromHex("00310400"), 10.0, Buffer.alloc(0)],
      // ["l2_enrg_imp_a", "1.49.8", bytesFromHex("00310800"), 3600000.0, Buffer.alloc(0)],
      // ["l2_pwr_exp_a", "1.50.4", bytesFromHex("00320400"), 10.0, Buffer.alloc(0)],
      // ["l2_enrg_exp_a", "1.50.8", bytesFromHex("00320800"), 3600000.0, Buffer.alloc(0)],
      ["amp_l2", "1.51.4", bytesFromHex("00330400"), 1000.0, Buffer.alloc(0)],
      ["volts_l2", "1.52.4", bytesFromHex("00340400"), 1000.0, Buffer.alloc(0)],
      // ["fact_l2", "1.53.4", bytesFromHex("00350400"), 1000.0, Buffer.from([0x03,0xE8])],

      ["l3_pwr_imp", "1.61.4", bytesFromHex("003D0400"), 10.0, Buffer.alloc(0)],
      ["l3_enrg_imp", "1.61.8", bytesFromHex("003D0800"), 3600000.0, Buffer.alloc(0)],
      ["l3_pwr_exp", "1.62.4", bytesFromHex("003E0400"), 10.0, Buffer.alloc(0)],
      ["l3_enrg_exp", "1.62.8", bytesFromHex("003E0800"), 3600000.0, Buffer.alloc(0)],
      // ["l3_pwr_imp_r", "1.63.4", bytesFromHex("003F0400"), 10.0, Buffer.alloc(0)],
      // ["l3_enrg_imp_r", "1.63.8", bytesFromHex("003F0800"), 3600000.0, Buffer.alloc(0)],
      // ["l3_pwr_exp_r", "1.64.4", bytesFromHex("00400400"), 10.0, Buffer.alloc(0)],
      // ["l3_enrg_exp_r", "1.64.8", bytesFromHex("00400800"), 3600000.0, Buffer.alloc(0)],
      // ["l3_pwr_imp_a", "1.69.4", bytesFromHex("00450400"), 10.0, Buffer.alloc(0)],
      // ["l3_enrg_imp_a", "1.69.8", bytesFromHex("00450800"), 3600000.0, Buffer.alloc(0)],
      // ["l3_pwr_exp_a", "1.70.4", bytesFromHex("00460400"), 10.0, Buffer.alloc(0)],
      // ["l3_enrg_exp_a", "1.70.8", bytesFromHex("00460800"), 3600000.0, Buffer.alloc(0)],
      ["amp_l3", "1.71.4", bytesFromHex("00470400"), 1000.0, Buffer.alloc(0)],
      ["volts_l3", "1.72.4", bytesFromHex("00480400"), 1000.0, Buffer.alloc(0)],
      // ["fact_l3", "1.73.4", bytesFromHex("00490400"), 1000.0, Buffer.alloc(0)],
    ];
  }

  updateValues(measurements) {
    for (const v of this.values) {
      const key = v[0];
      const len = v[2][2];
      if (Object.prototype.hasOwnProperty.call(measurements, key)) {
        //console.log(`Updating ${key} to ${measurements[key]}`);
        //console.log(`  Multiplier: ${v[3]}, Length: ${len}`);
        v[4] = this.num2bytes(measurements[key] * v[3], len);
      } else {
        v[4] = this.num2bytes(0 * v[3], len);
      }
    }
    this.dataValid = true;
  }

  num2bytes(value, length) {
    // only positive numbers length 1,2,4 or 8
    if (length <= 4) {
      return bytesAdd(Buffer.alloc(0), Math.floor(value), length);
    } else if (length === 8) {
      // replicate Python behavior: 2 bytes zeros + 4 bytes of int(value/65535) + 2 bytes zeros
      const part1 = bytesFromHex('0000');
      const high = Math.floor(value / 65535);
      const middle = bytesAdd(Buffer.alloc(0), high, 4);
      const part3 = bytesFromHex('0000');
      return Buffer.concat([part1, middle, part3]);
    } else {
      console.log('num2bytes: unsupported length', value, length);
      return Buffer.alloc(0);
    }
  }

  getPacket(time_ms) {
    if (this.dataValid) {
      this.emId = bytesSet(this.emId, 6, Math.floor(time_ms), 4);
      let dg = Buffer.concat([this.emHeader, this.emId]);
      let dl = 12;
      for (const v of this.values) {
        dg = Buffer.concat([dg, v[2], v[4]]);
        dl += 4 + v[2][2];
      }

      dg = Buffer.concat([dg, bytesFromHex('9000000002030452'), bytesFromHex('00000000')]);
      dl += 8;
      dg = bytesSet(dg, 12, dl, 2);
      return dg;
    } else {
      return null;
    }
  }
}

module.exports = { EmeterPacketizer, bytesFromHex, bytesSet, bytesAdd };
