import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IpTracker {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ip: string;

  @Column({ type: 'timestamp' })
  windowStart: Date;

  @Column()
  requestCount: number;

  @Column({ default: false })
  isBlock: boolean;

  @Column({ type: 'timestamp', nullable: true })
  blockUntil: Date | null;
}
